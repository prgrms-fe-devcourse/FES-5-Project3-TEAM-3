import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import useToast from '@/hook/useToast';
import supabase from '@/supabase/supabase';
import { useCommunityStore } from '@/pages/community/write/store/useCommunityStore';

export default function useEditPost() {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const toast = useToast;
  const setStoreState = useCommunityStore.setState;

  const state = location?.state ?? null;
  const isEditMode = state?.mode === 'edit' && state?.post;
  const editPost = isEditMode ? state.post : null;

  useEffect(() => {
    if (!isEditMode || !editPost) return;
    try {
      setStoreState({
        category: editPost.post_category ?? 'free',
        title: editPost.title ?? '',
        body: editPost.content ?? '',
        tagInput: '',
        tags: Array.isArray(editPost.hashtag_list) ? editPost.hashtag_list : (editPost.hashtag_list ? editPost.hashtag_list : []),
        imageFiles: [],
        imageUrls: Array.isArray(editPost.image_url) ? editPost.image_url : (editPost.image_url ? [editPost.image_url] : []),
        imageNames: [],
        primaryIdx: 0,
        previewIndex: 0,
      });
    } catch (e) {
      console.error('[useEditPost] fill edit store error', e);
    }
  }, [isEditMode, editPost, setStoreState]);

  const handleSaveEdit = async () => {
    if (!isEditMode || !editPost) return;
    try {
      const store = useCommunityStore.getState();
      const payload: any = {
        title: (store.title || 'untitled').trim(),
        content: store.body || '',
        post_category: store.category || 'free',
        hashtag_list: store.tags && store.tags.length > 0 ? store.tags : null,
      };
      if (Array.isArray(store.imageUrls) && store.imageUrls.length > 0) {
        payload.image_url = store.imageUrls;
        payload.thumbnail_image = store.imageUrls[store.primaryIdx ?? 0] ?? store.imageUrls[0];
      }

      const { error } = await supabase.from('posts').update(payload).eq('post_id', editPost.post_id).select().single();
      if (error) {
        console.error('[useEditPost] update error', error);
        toast('error', '수정에 실패했습니다.');
        return;
      }
      toast('success', '수정되었습니다.');
      navigate(`/community/detail/${editPost.post_id}`);
    } catch (e) {
      console.error('[useEditPost] handleSaveEdit caught', e);
      toast('error', '수정 중 오류가 발생했습니다.');
    }
  };

  return { isEditMode, handleSaveEdit };
}
