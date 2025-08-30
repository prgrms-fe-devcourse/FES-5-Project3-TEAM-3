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

  clearImages: () => void;
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
      const ableSlots = Math.max(0, maxImages - state.imageFiles.length);
      const incomingCount = Array.from(filesToAdd).length;
      if (ableSlots <= 0) {
        if (typeof window !== 'undefined') {
          window.alert(`이미지는 최대 ${maxImages}개까지 업로드할 수 있습니다.`);
        }
        return state;
      }
      if (incomingCount > ableSlots) {
        if (typeof window !== 'undefined') {
          window.alert(
            `선택한 파일 중 ${incomingCount - ableSlots}개는 최대 업로드 수(${maxImages}개)를 초과하여 제외됩니다.`
          );
        }
      }
      const toAdd = Array.from(filesToAdd).slice(0, ableSlots) as File[]; // 실제 추가 파일 배열
      const newUrls = toAdd.map((f) => URL.createObjectURL(f)); // 임시 URL 생성 추 후 public으로 치환

      const imageFiles = [...state.imageFiles, ...toAdd].slice(0, maxImages);
      const imageUrls = [...state.imageUrls, ...newUrls].slice(0, maxImages);
      const imageNames = [...state.imageNames, ...toAdd.map((f) => f.name)].slice(0, maxImages);

      const firstAdd = state.imageFiles.length === 0 && toAdd.length > 0;
      const primaryIdx = firstAdd ? 0 : state.primaryIdx;
      const previewIndex = firstAdd ? 0 : state.previewIndex;

      return { imageFiles, imageUrls, imageNames, primaryIdx, previewIndex };
    });
  },

  removeImageAt: (removeIndex) => {
    const current = get();
    // bounds 체크
    if (
      !Array.isArray(current.imageUrls) ||
      removeIndex < 0 ||
      removeIndex >= current.imageUrls.length
    )
      return;

    // revoke blob URL 안전하게
    let urlToRevoke = '';
    try {
      urlToRevoke = current.imageUrls[removeIndex];
      if (
        typeof urlToRevoke === 'string' &&
        urlToRevoke.startsWith('blob:') &&
        typeof URL !== 'undefined' &&
        URL.revokeObjectURL
      ) {
        URL.revokeObjectURL(urlToRevoke);
      }
    } catch (e) {
      // 무시
    }

    set((state) => {
      const imageUrls = state.imageUrls.filter((_, i) => i !== removeIndex);
      const imageFiles = state.imageFiles.filter((_, i) => i !== removeIndex);
      const imageNames = state.imageNames.filter((_, i) => i !== removeIndex);

      const len = imageUrls.length;

      // previewIndex 보정
      let previewIndex = typeof state.previewIndex === 'number' ? state.previewIndex : 0;
      if (len === 0) {
        previewIndex = 0;
      } else if (removeIndex < previewIndex) {
        previewIndex = previewIndex - 1;
      } else if (removeIndex === previewIndex) {
        previewIndex = Math.min(previewIndex, len - 1);
      }

      // primaryIdx 보정
      let primaryIdx = typeof state.primaryIdx === 'number' ? state.primaryIdx : 0;
      if (len === 0) {
        primaryIdx = 0;
      } else if (removeIndex < primaryIdx) {
        primaryIdx = primaryIdx - 1;
      } else if (removeIndex === primaryIdx) {
        primaryIdx = Math.min(primaryIdx, len - 1);
      }

      // body에서 해당 URL 사용하는 img태그 제거 TextEditor 동기화
      let newBody = state.body || '';
      try {
        const doc = new DOMParser().parseFromString(state.body || '', 'text/html');
        doc.querySelectorAll('img').forEach((img) => {
          if (img.getAttribute('src') === urlToRevoke) img.remove();
        });
        newBody = doc.body.innerHTML;
      } catch {
        // fallback: 단순 치환
        if (urlToRevoke) newBody = (state.body || '').split(urlToRevoke).join('');
      }

      return { imageUrls, imageFiles, imageNames, primaryIdx, previewIndex, body: newBody };
    });
  },

  /** 모든 이미지의 blob URL을 revoke하고 이미지 상태를 초기화 */
  clearImages: () => {
    const s = get();
    try {
      (s.imageUrls || []).forEach((u) => {
        if (
          typeof u === 'string' &&
          u.startsWith('blob:') &&
          typeof URL !== 'undefined' &&
          URL.revokeObjectURL
        ) {
          URL.revokeObjectURL(u);
        }
      });
    } catch (e) {
      // 무시
    }
    set({
      imageFiles: [],
      imageUrls: [],
      imageNames: [],
      primaryIdx: 0,
      previewIndex: 0,
      body: '',
    });
  },

  setPrimaryIdx: (primaryIndex) =>
    set((state) => (state.primaryIdx === primaryIndex ? {} : { primaryIdx: primaryIndex })),
  setPreviewIndex: (previewIndex) =>
    set((state) => (state.previewIndex === previewIndex ? {} : { previewIndex })),
}));
