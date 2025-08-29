import supabase from '@/supabase/supabase';

export async function usePost() {
  try {
    const { data, error } = await supabase.from('posts').select('*');
    if (error) console.error(error);
    return data;
  } catch {
    throw new Error('실패');
  }
}
