import supabase from '@/supabase/supabase';

export type CreatePostParams = {
  title: string;
  body: string;
  primaryIdx?: number;
  category?: string;
  tags?: string[] | null;
  userId?: string | null;
};

const VALID_CATEGORIES = ['free', 'question', 'review'];

export async function createCommunityPost(params: CreatePostParams) {
  const {
    title,
    body,
    category = '',
    tags = null,
    userId = null,
  } = params;

  const safeCategory = VALID_CATEGORIES.includes(category) ? category : '';

  try {
    // 현재 로그인된 auth 유저 조회
    let finalUserId: string | null = userId ?? null;
    let authUser: any = null;
    try {
      const { data: userData } = await supabase.auth.getUser();
      authUser = (userData as any)?.user ?? null;
    } catch {
      authUser = null;
    }

    // profile.profile_id가 auth.uid와 같은지 확인
    if (!finalUserId && authUser?.id) {
      try {
        const { data: user } = await supabase
          .from('profile')
          .select('profile_id')
          .eq('profile_id', authUser.id)
          .maybeSingle();
        if (user && (user as any).profile_id) finalUserId = (user as any).profile_id;
      } catch {}
    }

    // 이미지 생략(추후 확장)
    const payload: any = {
      title: (title || 'untitled').trim(),
      content: body || '',
      post_category: safeCategory,
      hashtag_list: tags && tags.length > 0 ? tags : null,
      // image_url, thumbnail_image 등은 DB 기본값 사용 (생략)
    };
    if (finalUserId) payload.user_id = finalUserId;

    const { data, error } = await supabase.from('posts').insert(payload).select().single();
    if (error) {
      console.error('[createCommunityPost] insert error', error, { payload });
      throw error;
    }
    return data;
  } catch (err: any) {
    console.error('[createCommunityPost] unexpected error', err);
    throw err;
  }
}
