import { useShallow } from 'zustand/react/shallow';
import { useCommunityStore } from '@/pages/community/write/store/useCommunityStore';

/**
 * selector: useCommunityPreview용 명시적 selector
 * - 어디서 어떤 프로퍼티를 가져오는지 한눈에 보이도록 export 합니다.
 */
export const selectCommunityPreview = (s: any) => ({
  imageUrls: s.imageUrls,
  removeImageAt: s.removeImageAt,
  setPreviewIndex: s.setPreviewIndex,
  setPrimaryIdx: s.setPrimaryIdx,

  category: s.category,
  title: s.title,
  body: s.body,

  previewIndex: s.previewIndex,
});

/** 프리뷰(우측)에서 사용하는 상태/액션 래퍼 */
export function useCommunityPreview() {
  return useCommunityStore(useShallow(selectCommunityPreview));
}
