import TextEditor from '@/component/community/TextEditor';
import TagInput from '@/component/TagInput';
import { useCommunityForm } from '@/hook/community/useCommunityForm';

function LeftContent() {
  const {
    // form state / actions
    category,
    setCategory,
    title,
    setTitle,
    body,
    tagInput,
    setTagInput,
    addTag,
    tags,
    removeTag,
    clearTags,

    // left-content 특정 핸들러
    isSaving,
    handleEditorChange,
    handleInsertImages,
    handleSave,
    preventFormSubmit,
  } = useCommunityForm();

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

      {/* textarea → TextEditor */}
      <TextEditor
        value={body}
        onChange={handleEditorChange} // 훅에서 제공하는 변경 핸들러
        onInsertImages={handleInsertImages} // 훅에서 제공하는 이미지 삽입 핸들러
      />

      <TagInput
        value={tagInput}
        onChange={setTagInput}
        onAdd={addTag}
        tags={tags}
        onRemove={removeTag}
        onClear={clearTags}
        max={5}
      />

      {/* 저장 */}
      <div className="pt-2 flex items-center justify-end gap-3">
        <button
          type="button"
          className="px-5 py-2 rounded-xl border border-gray-300 bg-white text-sm hover:bg-gray-50"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 rounded-xl bg-primary-400 text-white text-sm shadow-sm hover:bg-primary-600 disabled:opacity-60"
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
}

export default LeftContent;
