import supabase from '@/supabase/supabase';
import { useQuery } from '@tanstack/react-query';

export async function usePost() {
  try {
    const { data, error } = await supabase.from('posts').select('*');
    if (error) console.error(error);
    return data;
  } catch {
    throw new Error('posts를 찾는데 실패했습니다');
  }
}

export async function useHashCount() {
  try {
    const { data, error } = await supabase
      .from('hashtag_counts')
      .select('*')
      .limit(5)
      .order('tag_count', { ascending: true });
    if (error) console.error(error);
    return data;
  } catch {
    throw new Error('hashtag_counts를 찾는데 실패했습니다');
  }
}

export type ProfileRow = {
  profile_id: string;
  nickname: string | null;
  profile_image_url: string | null;
  updated_at: string | null; 
};

// 순수 fetch 함수 (비동기 함수)
export async function getProfile(profileId: string) {
  const { data, error } = await supabase
    .from('profile')
    .select('profile_id, nickname, profile_image_url, updated_at')
    .eq('profile_id', profileId)
    .maybeSingle<ProfileRow>();

  if (error) throw error;
  return data; // ProfileRow | null
}

// ✅ 실제로 컴포넌트에서 사용할 "훅"
export function useProfile(profileId?: string) {
  return useQuery({
    queryKey: ['profileBasic', profileId],
    queryFn: () => getProfile(profileId!), // profileId가 있을 때만 실행
    enabled: !!profileId, // userId 없으면 호출 안 함
    staleTime: 60_000, // 선택
  });
}