import TextEditor from '@/component/community/TextEditor';
import { useCommunityForm } from '@/hook/community/useCommunityForm';
import { useCommunityStore } from '@/pages/community/write/store/useCommunityStore';
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
    // imageNames,
  } = useCommunityForm();

  // 1) 스토어 addImages로 썸네일/대표선택 데이터 업데이트
  // 2) 추가된 URL들을 에디터에 삽입(중복 createObjectURL 방지 위해 스토어에서 가져옴)
  const handleInsertImages = async (files: File[]) => {
    const before = useCommunityStore.getState().imageUrls.length;
    addImages(files, 5);
    const all = useCommunityStore.getState().imageUrls;
    const added = all.slice(before); // 방금 추가된 항목들
    return added; // 에디터에 삽입할 URL 배열
  };

  // const displayText =
  //   !imageNames || imageNames.length === 0
  //     ? '선택된 이미지가 없습니다.'
  //     : imageNames.length <= 3
  //       ? imageNames.join(', ')
  //       : `${imageNames.slice(0, 3).join(', ')} 외 ${imageNames.length - 3}개`;

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

        <select
          className="mt-2 block w-48 rounded-xl border border-gray-200 bg-white/70 px-3 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={preventFormSubmit}
        />
      </label>

      {/* 내용 */}
      {/*       <label className="block mb-4">
        <textarea
          placeholder="내용을 입력하세요"
          className="mt-2 block w-full rounded-xl border border-gray-200 bg-white/70 resize-none px-3 py-2"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={14}
        />
      </label> */}

      {/* textarea → TextEditor */}
      <TextEditor
        value={body}
        onChange={(html) => setBody(html)} // 본문을 HTML로 저장
        onInsertImages={handleInsertImages} // 업로드 시 본문 커서 위치에 이미지 삽입
      />

      {/* 숨겨진 실제 input (라벨 밖) */}
      {/* <input
        id="images"
        type="file"
        name="images"
        className="sr-only"
        multiple
        accept="image/*"
        onChange={onImagesChange}
      /> */}

      {/* 커스텀 박스 (htmlFor로 연결) */}
      {/* <label htmlFor="images" className="mb-4 block">
        <span className="text-sm font-medium">이미지</span>

        <div className="mt-2 flex items-center justify-between rounded-xl border border-gray-200 bg-white/70 px-3 py-2 cursor-pointer">
          <span
            className={`text-sm truncate ${!imageNames || imageNames.length === 0 ? 'text-gray-400' : 'text-gray-800'}`}
            aria-live="polite"
            title={(imageNames || []).join(', ')}
          >
            {displayText}
          </span>

          <span className="shrink-0 rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-primary-400 hover:text-white">
            파일 선택
          </span>
        </div>
      </label> */}

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
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
          />
          <button
            type="button"
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-primary-300 hover:text-white"
            onClick={() => addTag()}
          >
            추가
          </button>
        </div>

        {/* 태그 리스트 */}
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.length === 0 ? (
            <div className="text-sm text-gray-400">등록된 태그 없음</div>
          ) : (
            tags.map((t: string) => (
              <span
                key={t}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-400 text-sm text-primary-400 bg-white shadow-sm"
              >
                <span className="text-sm">{t}</span>
                <button type="button" className="text-xs text-red-500" onClick={() => removeTag(t)}>
                  ✕
                </button>
              </span>
            ))
          )}
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
          className="px-6 py-2 rounded-xl bg-primary-400 text-white text-sm shadow-sm hover:bg-primary-600"
        >
          저장
        </button>
      </div>
    </div>
  );
}

export default LeftContent;
