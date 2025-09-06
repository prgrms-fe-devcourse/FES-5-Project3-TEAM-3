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
      .from('wine_tag_counts')
      .select('*')
      .order('total_tag_count', { ascending: false });
    if (error) console.error(error);
    if (data) {
      const seen = new Set<string>();
      const top5 = data
        .filter((item) => {
          if (seen.has(item.tag!)) return false;
          seen.add(item.tag!);
          return true;
        })
        .slice(0, 5);

      return top5;
    }
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
