import { useShallow } from 'zustand/react/shallow';
import { useCommunityStore } from '@/pages/community/write/store/useCommunityStore';

/** 컨텐츠(좌측)에서 사용하는 상태/액션 래퍼 */
/**
 * selector: useCommunityForm용 명시적 selector
 * - 이름을 export해 어디서 어떤 프로퍼티를 가져오는지 바로 확인 가능하게 합니다.
 */
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

  // images
  addImages: s.addImages,
  imageNames: s.imageNames,
});

/** 컨텐츠(좌측)에서 사용하는 상태/액션 래퍼 */
export function useCommunityForm() {
  return useCommunityStore(useShallow(selectCommunityForm));
}
