import supabase from '@/supabase/supabase';

interface Args {
  bucketName: string;
  file: File;
  path: string;
  signal?: AbortSignal;
}

/**
 * Supabase Storage에 파일을 업로드하는 async 함수입니다.
 * @param bucketName: 파일을 업로드할 Storage의 bucket 이름
 * @param file: 업로드 대상 파일
 * @param path: 버킷 내에 저장할 파일 이름 (예: userAvatar123.png)
 * @param signal: signal.abort()가 호출될 경우 AbortError를 던지고 결과 출력을 중단합니다.
 * @returns 업로드 성공 시 { success: true, url: publicUrl } 을 반환하며, 실패 시 { success: false, error: errorMessage } 를 반환합니다.
 */

export const uploadImage = async ({
  bucketName,
  file,
  path,
  signal,
}: Args): Promise<{ success: boolean; url?: string; error?: string }> => {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  let aborted = false;
  const onAbort = () => {
    aborted = true;
  };
  signal?.addEventListener('abort', onAbort, { once: true });

  try {
    const { error } = await supabase.storage.from(bucketName).upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    });

    if (aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }
    if (error) {
      return { success: false, error: error.message };
    }

    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(path);

    return { success: true, url: urlData.publicUrl };
  } finally {
    signal?.removeEventListener('abort', onAbort);
  }
};
