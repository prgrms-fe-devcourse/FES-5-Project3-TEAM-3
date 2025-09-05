import supabase from '@/supabase/supabase';

/** 안전한 파일명(랜덤 + 원본 확장자) 생성 */
function makeFileName(file: File) {
  const uid =
    typeof crypto !== 'undefined' && (crypto as any).randomUUID
      ? (crypto as any).randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const extMatch = file.name.match(/\.[^./\\?%*:|"<>]+$/);
  const ext = extMatch ? extMatch[0] : '';
  return `${uid}${ext}`;
}

/**
 * files: 업로드할 File[] (새로 추가된 파일 객체)
 * imageUrls: 현재 스토어의 imageUrls 배열 (publicUrl 또는 blob:... 혼합)
 * imageNames: 현재 스토어의 imageNames 배열 (파일명 또는 기존 public 파일명)
 *
 * 반환:
 * { publicUrls, paths, mapping, finalImageUrls }
 * - mapping: { [blobUrl]: publicUrl }
 * - finalImageUrls: original imageUrls에서 blob 항목을 mapping으로 치환한 최종 배열 (순서 보존)
 */
export async function uploadFilesToBucket(
  files: File[],
  bucket = 'post_images',
  imageUrls: (string | null)[] = [],
  imageNames: (string | null)[] = []
) {
  if (!files || files.length === 0) {
    // 파일 없으면 이미지 배열 그대로 반환 (mapping 빈 객체)
    return { publicUrls: [], paths: [], mapping: {}, finalImageUrls: imageUrls.slice() };
  }

  const { data: userData } = await supabase.auth.getUser();
  const userId = (userData as any)?.user?.id;
  if (!userId) throw new Error('업로드 실패: 로그인된 사용자가 아닙니다.');

  const publicUrls: string[] = [];
  const paths: string[] = [];

  // 업로드 (전달된 File[] 먼저 업로드)
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filename = makeFileName(file);
    const path = `${userId}/posts/${filename}`;
    try {
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });
      if (error) throw new Error(error.message || JSON.stringify(error));
      const { data: urlData } = await supabase.storage.from(bucket).getPublicUrl(path);
      const publicUrl = (urlData as any)?.publicUrl ?? (urlData as any)?.public_url ?? '';
      publicUrls.push(publicUrl);
      paths.push(path);
    } catch (err: any) {
      console.error('[uploadFilesToBucket] upload error detail', {
        message: err?.message ?? err,
        thrown: err,
        path,
        fileName: file.name,
      });
      throw { err, path, fileName: file.name };
    }
  }

  // 매핑 생성: files[] 순서 -> imageNames/imageUrls 위치 매칭
  const mapping: Record<string, string> = {};
  const names = (imageNames || []).slice();
  const urls = (imageUrls || []).slice();

  for (let i = 0; i < publicUrls.length; i++) {
    const pub = publicUrls[i];
    const file = files[i];

    // 1) 같은 파일명(imageNames) 위치 찾기 (첫번째 일치)
    let idx = -1;
    if (file && names.length > 0) {
      idx = names.findIndex((n) => n === file.name);
    }

    if (idx !== -1) {
      const possible = urls[idx];
      if (typeof possible === 'string' && possible.startsWith('blob:')) {
        mapping[possible] = pub;
        names[idx] = null;
        urls[idx] = null;
        continue;
      }
    }

    // 2) fallback: 남아있는 첫 blob 위치에 매핑
    const blobIndex = urls.findIndex((u) => typeof u === 'string' && (u as string).startsWith('blob:'));
    if (blobIndex !== -1) {
      const blobUrl = urls[blobIndex] as string;
      mapping[blobUrl] = pub;
      names[blobIndex] = null;
      urls[blobIndex] = null;
      continue;
    }

    // 3) 만약 더 이상 blob이 없으면 (기존 public들 사이에 새 추가된 경우)
    // 새로 추가된 파일은 맨 끝에 붙이는 정책으로 publicUrls 배열을 따로 보존
  }

  // --- 추가: 아직 mapping에 없는 blob URL(파일 객체 없이 생긴 blob: URL) 업로드 처리 ---
  const remainingUrls = (imageUrls || []).slice();
  const unmappedBlobs = remainingUrls.filter(
    (u) => typeof u === 'string' && (u as string).startsWith('blob:') && !(u in mapping)
  ) as string[];

  for (const blobUrl of unmappedBlobs) {
    try {
      // fetch blob from blob: URL and convert to File
      const resp = await fetch(blobUrl);
      const blob = await resp.blob();
      const mime = blob.type || 'image/jpeg';
      const ext = (mime.split('/')[1] || 'jpg').split('+')[0];
      const filename = makeFileName(new File([blob], `pasted.${ext}`, { type: mime }));
      const path = `${userId}/posts/${filename}`;
      const file = new File([blob], filename, { type: mime });

      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });
      if (error) {
        console.error('[uploadFilesToBucket] upload pasted blob error', { blobUrl, error });
        continue;
      }
      const { data: urlData } = await supabase.storage.from(bucket).getPublicUrl(path);
      const publicUrl = (urlData as any)?.publicUrl ?? (urlData as any)?.public_url ?? '';
      // mapping 및 결과에 추가
      mapping[blobUrl] = publicUrl;
      publicUrls.push(publicUrl);
      paths.push(path);
      // revoke local blobURL if possible
      try {
        if (typeof URL !== 'undefined' && URL.revokeObjectURL) URL.revokeObjectURL(blobUrl);
      } catch {}
    } catch (e) {
      console.error('[uploadFilesToBucket] fetch pasted blob error', { blobUrl, err: e });
      continue;
    }
  }

  // finalImageUrls: 원본 imageUrls 순서 보존하며 blob 치환
  const finalImageUrls = (imageUrls || []).map((u) => {
    if (typeof u === 'string' && u.startsWith('blob:')) {
      return mapping[u] ?? null;
    }
    return u;
  });

  // 이후에도 uploaded files 중 매핑되지 않은 publicUrls(추가된 파일) 있으면 append
  const mappedPubSet = new Set(Object.values(mapping));
  const remainingPubs = publicUrls.filter((p) => !mappedPubSet.has(p));
  const final = finalImageUrls.concat(remainingPubs).filter(Boolean) as string[];

  return { publicUrls, paths, mapping, finalImageUrls: final };
}
