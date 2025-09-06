import supabase from '@/supabase/supabase';

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
      .order('tag_count', { ascending: false });
    if (error) console.error(error);
    return data;
  } catch {
    throw new Error('hashtag_counts를 찾는데 실패했습니다');
  }
}

export async function useProfile() {
  try {
    const { data, error } = await supabase.from('profile').select('nickname');
    if (error) console.error(error);
    return data;
  } catch {
    throw new Error('profile 테이블 데이터를 불러오는데 실파했습니다');
  }
}
