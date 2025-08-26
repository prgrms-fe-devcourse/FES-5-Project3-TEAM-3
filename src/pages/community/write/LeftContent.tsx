import { useCommunityForm } from '@/hook/community/useCommunityForm';
import React from 'react';

function LeftContent() {
  const {
    category,
    setCategory,
    title,
    setTitle,
    body,
    setBody,
    tagInput,
    setTagInput,
    addTag,
    tags,
    removeTag,
    addImages,
    imageNames,
  } = useCommunityForm();

  const onImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    addImages(files, 5);
    e.currentTarget.value = '';
  };

  const displayText =
    !imageNames || imageNames.length === 0
      ? '선택된 이미지가 없습니다.'
      : imageNames.length <= 3
      ? imageNames.join(', ')
      : `${imageNames.slice(0, 3).join(', ')} 외 ${imageNames.length - 3}개`;

  const preventFormSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="col-span-12 lg:col-span-6 gap-10">
      <label className="block mb-4">
        <span className="text-sm font-medium">카테고리</span>

          <select className="mt-2 block w-48 rounded-xl border border-gray-200 bg-white/70 px-3 py-2">
            <option>선택해주세요</option>
            <option value="review">리뷰</option>
            <option value="free">자유</option>
            <option value="question">질문</option>
          </select>
        </label>

        {/* 제목 */}
        <label className="block mb-4">
          <input
            type="text"
            placeholder="제목을 입력하세요"
            className="mt-2 block w-full rounded-xl border border-gray-200 bg-white/70 px-3 py-2"
          />
        </label>

        {/* 내용 */}
        <label className="block mb-4">
          <textarea
            placeholder="내용을 입력하세요"
            className="mt-2 block w-full rounded-xl border border-gray-200 bg-white/70 px-3 py-2"
            rows={4}
          />
        </label>

        {/* 이미지 */}
        <label className="mb-4">
          <span className="text-sm font-medium">이미지</span>
          <input
            type="file"
            className="mt-2 block w-70 text-sm rounded-xl border border-gray-200 bg-white/70 px-3 py-2"
            multiple
          />
        </label>

      {/* 태그 추가 */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">태그</span>
        </div>

          <div className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="추가 태그 입력 (최대 5개)"
              className="rounded-xl border border-gray-200 bg-white/70 px-4 py-2.5 flex-1"
            />
            <button className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-[var(--color-primary-300)] hover:text-white">
              추가
            </button>
          </div>

          {/* 태그 삭제버튼 */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#e8d8d8] text-sm
                                bg-white shadow-sm"
            >
              <button type="button" className="text-xs text-red-500">
                ✕
              </button>
            </span>
          </div>
        </div>

      <div className="pt-2 flex items-center justify-end gap-3">
        <button
          type="button"
          className="px-5 py-2 rounded-xl border border-gray-300 bg-white text-sm hover:bg-gray-50"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-xl bg-[var(--color-primary-400)] text-white text-sm shadow-sm hover:bg-[var(--color-primary-600)]"
        >
          저장
        </button>
      </div>
    </div>
  );
}

export default LeftContent;
