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
    const { data, error } = await supabase.from('hashtag_counts').select('*').limit(5).order('tag_count',{ascending:true})
    if (error) console.error(error)
    return data
  }
  catch {
    throw new Error('hashtag_conts를 찾는데 실패했습니다')
  }
}