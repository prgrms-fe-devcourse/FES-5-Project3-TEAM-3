import { useCallback, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCommunityStore } from '@/pages/community/write/store/useCommunityStore';
import supabase from '@/supabase/supabase';
import { uploadFilesToBucket } from '@/supabase/community/uploadImages';
import { createCommunityPost } from '@/supabase/community/communityCreate';
import useToast from '@/hook/useToast';

/** 컨텐츠(좌측)에서 사용하는 상태/액션 래퍼 (기존 selector 유지) */
export const selectCommunityForm = (s: any) => ({
  // form
  category: s.category,
  setCategory: s.setCategory,
  title: s.title,
  setTitle: s.setTitle,
  body: s.body,
  setBody: s.setBody,

  // tags
  tagInput: s.tagInput,
  setTagInput: s.setTagInput,
  tags: s.tags,
  addTag: s.addTag,
  removeTag: s.removeTag,
  clearTags: s.clearTags,

  // images
  addImages: s.addImages,
  imageNames: s.imageNames,

  // store helpers used by left-content
  clearImages: s.clearImages,
  removeImageAt: s.removeImageAt,
  imageUrls: s.imageUrls,
  imageFiles: s.imageFiles,
  primaryIdx: s.primaryIdx,
});

/**
 * useCommunityForm 훅
 * - 기존에 제공하던 상태/액션(selectCommunityForm)을 그대로 반환
 * - LeftContent에서 필요로 하는 비즈니스 핸들러(handleEditorChange, handleInsertImages, handleSave 등)를 함께 제공
 */
export function useCommunityForm() {
  const form = useCommunityStore(useShallow(selectCommunityForm));

  const {
    category, setCategory,
    title, setTitle,
    body, setBody,
    setTagInput,
    tags, removeTag,
    addImages,
    clearImages, removeImageAt,
  } = form;

  const [isSaving, setIsSaving] = useState(false);

  const getStoreState = () => useCommunityStore.getState();

  const handleEditorChange = useCallback((html: string) => {
    setBody(html);

    let doc: Document | null = null;
    try {
      doc = new DOMParser().parseFromString(html || '', 'text/html');
    } catch {
      doc = null;
    }
    const presentSrcs = doc
      ? Array.from(doc.querySelectorAll('img')).map((img) => img.getAttribute('src') || '')
      : [];

    const storeUrls = getStoreState().imageUrls || [];
    const toRemove = storeUrls
      .map((u: string, i: number) => ({ u, i }))
      .filter(({ u }) => u && !presentSrcs.includes(u))
      .map(({ i }) => i)
      .sort((a, b) => b - a);

    toRemove.forEach((idx) => {
      if (typeof removeImageAt === 'function') removeImageAt(idx);
    });
  }, [setBody, removeImageAt]);

  const handleInsertImages = useCallback(async (files: File[]) => {
    const before = getStoreState().imageUrls.length;
    addImages(files, 5);
    const all = getStoreState().imageUrls || [];
    const added = all.slice(before);
    return added;
  }, [addImages]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const resp = await supabase.auth.getUser();
      const user = (resp as any)?.data?.user ?? (resp as any)?.user ?? null;
      if (!user) {
        useToast('info', '로그인이 필요합니다. 로그인 후 시도하세요.');
        setIsSaving(false);
        return;
      }

      const store = getStoreState();
      const files: File[] = store.imageFiles ?? [];
      const blobs: string[] = store.imageUrls ?? [];
      const primaryIdx = typeof store.primaryIdx === 'number' ? store.primaryIdx : 0;

      const STORAGE_BUCKET = (import.meta.env.VITE_SUPABASE_STORAGE_BUCKET as string) ?? 'post_images';
      let publicUrls: string[] = [];
      if (files.length > 0) {
        const res = await uploadFilesToBucket(files, STORAGE_BUCKET);
        publicUrls = res?.publicUrls || [];
      }

      let newBody = body || '';
      for (let i = 0; i < blobs.length; i++) {
        const blobUrl = blobs[i];
        const pub = publicUrls[i];
        if (blobUrl && pub) newBody = newBody.split(blobUrl).join(pub);
      }

      await createCommunityPost({
        title,
        body: newBody,
        imageUrls: publicUrls,
        primaryIdx,
        category,
        tags,
        userId: undefined,
      });

      if (typeof clearImages === 'function') clearImages();
      setCategory('');
      setTitle('');
      setBody('');
      setTagInput('');
      try {
        (tags || []).slice().forEach((t: any) => removeTag(t));
      } catch {}
      window.alert('게시가 완료되었습니다.');
    } catch (err: any) {
      console.error('Save error', err);
      window.alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [body, title, category, tags, clearImages, removeTag, setBody, setTitle, setTagInput, setCategory]);

  const preventFormSubmit = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault();
  }, []);

  return {
    // 기존 폼 상태/액션 (기존 사용처 호환)
    ...form,
    // LeftContent 전용 핸들러
    isSaving,
    handleEditorChange,
    handleInsertImages,
    handleSave,
    preventFormSubmit,
  };
}
