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
 * 여러 파일을 사용자 폴더로 직접 업로드하고 publicUrl 반환
 */
export async function uploadFilesToBucket(files: File[], bucket = 'post_images') {
  if (!files || files.length === 0) return { publicUrls: [], paths: [] };

  const { data: userData } = await supabase.auth.getUser();
  const userId = (userData as any)?.user?.id;
  if (!userId) throw new Error('업로드 실패: 로그인된 사용자가 아닙니다.');

  const publicUrls: string[] = [];
  const paths: string[] = [];

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

      if (error) {
        throw new Error(error.message || JSON.stringify(error));
      }

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

  return { publicUrls, paths };
}
