import supabase from '@/supabase/supabase';
import { create } from 'zustand';

// 상태 타입
interface CommunityData {
  category: string;
  title: string;
  body: string;
  tagInput: string;
  tags: string[];

  imageFiles: File[];
  imageUrls: string[];
  imageNames: string[];
  primaryIdx: number;
  previewIndex: number;

  isSubmitting: boolean;
  error?: string | null;
}

// 액션 타입
interface CommunityActions {
  /** LeftContent.tsx : Form*/
  setCategory: (newCategory: string) => void;
  setTitle: (newTitle: string) => void;
  setBody: (newBody: string) => void;
  setTagInput: (newTagInput: string) => void;

  /** LeftContent.tsx : Tags */
  addTag: () => void;
  removeTag: (tagToRemove: string) => void;
  clearTags: () => void;

  /** LeftContent.tsx(업로드), RightPreview.tsx(미리보기/삭제) : Images */
  addImages: (filesToAdd: File[], maxImages?: number) => void;
  removeImageAt: (removeIndex: number) => void;
  setPrimaryIdx: (primaryIndex: number) => void;
  setPreviewIndex: (previewIndex: number) => void;

}

type CommunityState = CommunityData & CommunityActions;

export const useCommunityStore = create<CommunityState>((set, get) => ({
  // ===== Form =====
  category: '',
  title: '',
  body: '',
  tagInput: '',
  tags: [],

  // ===== Images =====
  imageFiles: [],
  imageUrls: [],
  imageNames: [],
  primaryIdx: 0,
  previewIndex: 0,

  // ===== UI =====
  isSubmitting: false,
  error: null,

  // ===== Actions =====
  setCategory: (newCategory) => set({ category: newCategory }),
  setTitle: (newTitle) => set({ title: newTitle }),
  setBody: (newBody) => set({ body: newBody }),
  setTagInput: (newTagInput) => set({ tagInput: newTagInput }),

  addTag: () => {
    const currentInput = get().tagInput.trim();
    if (!currentInput) return;
    set((state) => {
      if (state.tags.includes(currentInput)) return state;
      if (state.tags.length >= 5) {
        // 사용자에게 제한 알림
        if (typeof window !== 'undefined' && typeof window.alert === 'function') {
          window.alert('태그는 최대 5개까지 등록할 수 있습니다.');
        }
        return state;
      }
      return { tags: [...state.tags, currentInput], tagInput: '' };
    });
  },

  removeTag: (tagToRemove) =>
    set((state) => ({ tags: state.tags.filter((t) => t !== tagToRemove) })),

  clearTags: () => set({ tags: [] }),

  addImages: (filesToAdd, maxImages = 5) => {
    set((state) => {
      const availableSlots = Math.max(0, maxImages - state.imageFiles.length);
      const incomingCount = Array.from(filesToAdd).length;
      if (availableSlots <= 0) {
        if (typeof window !== 'undefined') {
          window.alert(`이미지는 최대 ${maxImages}개까지 업로드할 수 있습니다.`);
        }
        return state;
      }
      if (incomingCount > availableSlots) {
        if (typeof window !== 'undefined') {
          window.alert(`선택한 파일 중 ${incomingCount - availableSlots}개는 최대 업로드 수(${maxImages}개)를 초과하여 제외됩니다.`);
        }
      }
      const toAdd = Array.from(filesToAdd).slice(0, availableSlots) as File[];
      const newUrls = toAdd.map((f) => URL.createObjectURL(f));
      return {
        imageFiles: [...state.imageFiles, ...toAdd].slice(0, maxImages),
        imageUrls: [...state.imageUrls, ...newUrls].slice(0, maxImages),
        imageNames: [...state.imageNames, ...toAdd.map((f) => f.name)].slice(0, maxImages),
      };
    });
  },

  removeImageAt: (removeIndex) => {
    const current = get();
    const urlToRevoke = current.imageUrls[removeIndex];
    if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);

    set((state) => {
      const imageUrls = state.imageUrls.filter((_, i) => i !== removeIndex);
      const imageFiles = state.imageFiles.filter((_, i) => i !== removeIndex);
      const imageNames = state.imageNames.filter((_, i) => i !== removeIndex);

      const primaryIdx = Math.max(0, Math.min(state.primaryIdx, Math.max(0, imageUrls.length - 1)));
      const previewIndex = Math.max(0, Math.min(state.previewIndex, Math.max(0, imageUrls.length - 1)));
      return { imageUrls, imageFiles, imageNames, primaryIdx, previewIndex };
    });
  },

  setPrimaryIdx: (primaryIndex) =>
    set((state) => (state.primaryIdx === primaryIndex ? state : { primaryIdx: primaryIndex })),
  setPreviewIndex: (previewIndex) =>
    set((state) => (state.previewIndex === previewIndex ? state : { previewIndex })),

}));

export const fetchData = create((set) => ({
  user: [],
  fetch: async() => {
    const { data } =await supabase.from('reply').select('*,user_id(*)')
    set({user:data})
  }
}))