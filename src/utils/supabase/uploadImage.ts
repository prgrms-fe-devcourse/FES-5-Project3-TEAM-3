import supabase from '@/supabase/supabase';

interface Args {
  bucketName: string;
  file: File;
  path: string;
}

/**
 * Supabase Storage에 파일을 업로드하는 async 함수입니다.
 * @param bucketName: 파일을 업로드할 Storage의 bucket 이름
 * @param file: 업로드 대상 파일
 * @param path: 버킷 내에 저장할 파일 이름 (예: userAvatar123.png)
 * @returns 업로드 성공 시 { success: true, url: publicUrl } 을 반환하며, 실패 시 { success: false, error: errorMessage } 를 반환합니다.
 */

export const uploadImage = async ({
  bucketName,
  file,
  path,
}: Args): Promise<{ success: boolean; url?: string; error?: string }> => {
  const { error } = await supabase.storage.from(bucketName).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(path);

  return { success: true, url: urlData.publicUrl };
};
