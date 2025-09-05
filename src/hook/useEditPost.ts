import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import useToast from '@/hook/useToast';
import supabase from '@/supabase/supabase';
import { useCommunityStore } from '@/pages/community/write/store/useCommunityStore';
import { uploadFilesToBucket } from '@/supabase/community/uploadImages';

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
        tags: Array.isArray(editPost.hashtag_list)
          ? editPost.hashtag_list
          : editPost.hashtag_list
            ? editPost.hashtag_list
            : [],
        imageFiles: [],
        imageUrls: Array.isArray(editPost.image_url)
          ? editPost.image_url
          : editPost.image_url
            ? [editPost.image_url]
            : [],
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

      // 업로드 처리: 이미 파일 객체(files)와 imageUrls/imageNames를 전달해
      // blob(URL) -> publicUrl 치환 및 finalImageUrls 반환 받음
      const files: File[] = store.imageFiles ?? [];
      const storeImageUrls = store.imageUrls ?? [];
      const storeImageNames = store.imageNames ?? [];
      const BUCKET = (import.meta.env.VITE_SUPABASE_STORAGE_BUCKET as string) ?? 'post_images';

      let mapping: Record<string, string> = {};
      // store.imageUrls는 (string | null)[] 일 수 있으므로 먼저 같은 타입으로 둠
      let finalImageUrls: (string | null)[] = storeImageUrls.slice();
      let newBody = store.body || '';

      if (files.length > 0 || (storeImageUrls || []).some((u) => typeof u === 'string' && (u as string).startsWith('blob:'))) {
        const res = await uploadFilesToBucket(files, BUCKET, storeImageUrls, storeImageNames);
        mapping = res.mapping || {};
        // res.finalImageUrls는 string[]이므로 (string|null)[] 변수에 안전하게 할당
        finalImageUrls = res.finalImageUrls || [];
        // 본문 내부 blob 치환
        for (const [blobUrl, pubUrl] of Object.entries(mapping)) {
          if (blobUrl && pubUrl) newBody = newBody.split(blobUrl).join(pubUrl);
        }
      } else {
        // 파일 변경이 없다면 그대로 (단 null/undefined 제거)
        finalImageUrls = (storeImageUrls || []).filter((u): u is string => Boolean(u));
      }

      const payload: any = {
        title: (store.title || 'untitled').trim(),
        content: newBody,
        post_category: store.category || 'free',
        hashtag_list: store.tags && store.tags.length > 0 ? store.tags : null,
      };
      // DB에 넣기 전 null/빈 값 제거하여 string[]로 정리
      const safeFinalUrls: string[] = (finalImageUrls || []).filter(
        (u): u is string => typeof u === 'string' && u.trim() !== ''
      );
      if (safeFinalUrls && safeFinalUrls.length > 0) {
        payload.image_url = safeFinalUrls;
        payload.thumbnail_image = safeFinalUrls[store.primaryIdx ?? 0] ?? safeFinalUrls[0];
      } else {
        // 이미지가 완전히 제거된 경우 필드 제거(또는 null 설정으로 처리)
        payload.image_url = null;
        payload.thumbnail_image = null;
      }

      const { error } = await supabase
        .from('posts')
        .update(payload)
        .eq('post_id', editPost.post_id)
        .select()
        .single();
      if (error) {
        console.error('[useEditPost] update error', error, { payload });
        toast('error', '수정에 실패했습니다.');
        return;
      }
      toast('success', '수정되었습니다.');
      // 상세로 이동하여 최신 데이터 조회
      navigate(`/community/detail/${editPost.post_id}`, { replace: true });
    } catch (e) {
      console.error('[useEditPost] handleSaveEdit caught', e);
      toast('error', '수정 중 오류가 발생했습니다.');
    }
  };

  return { isEditMode, handleSaveEdit };
}
