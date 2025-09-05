import supabase from '@/supabase/supabase';

export type CreatePostParams = {
  title: string;
  body: string;
  imageUrls?: (string | null)[]; // 변경: nullable 허용
  primaryIdx?: number; // 대표 이미지 인덱스
  category?: string;
  tags?: string[] | null;
  userId?: string | null;
};

const VALID_CATEGORIES = ['free', 'question', 'review'];

export async function createCommunityPost(params: CreatePostParams) {
  const {
    title,
    body,
    imageUrls = [],
    primaryIdx = 0,
    category = '',
    tags = null,
    userId = null,
  } = params;

  // imageUrls 내부에 null/undefined/빈문자열이 있을 수 있으므로 안전하게 정리
  const safeImageUrls: string[] = Array.isArray(imageUrls)
    ? imageUrls.filter((u): u is string => typeof u === 'string' && u.trim() !== '')
    : [];

  // 유효하지 않은 카테고리는 기본 'free' 사용
  const safeCategory = VALID_CATEGORIES.includes(category) ? category : 'free';

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

    // payload에 image_url 배열 및 thumbnail_image(사용자가 선택한 인덱스 우선) 포함
    const payload: any = {
      title: (title || 'untitled').trim(),
      content: body || '',
      post_category: safeCategory,
      hashtag_list: tags && tags.length > 0 ? tags : null,
      ...(safeImageUrls && safeImageUrls.length > 0
        ? {
            image_url: safeImageUrls,
            thumbnail_image:
              typeof primaryIdx === 'number' && primaryIdx >= 0 && primaryIdx < safeImageUrls.length
                ? safeImageUrls[primaryIdx]
                : safeImageUrls[0],
          }
        : {}),
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
