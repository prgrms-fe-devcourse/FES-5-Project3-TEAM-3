import TextEditor from '@/component/community/TextEditor';
import TagInput from '@/component/TagInput';
import { useCommunityForm } from '@/hook/community/useCommunityForm';
import { useLocation, useNavigate } from 'react-router';

function LeftContent({ onSave }: { onSave?: () => Promise<void> | void }) {
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

    // 추가: 이미지 초기화 사용
    clearImages,
  } = useCommunityForm();

  const navigate = useNavigate();
  const location = useLocation() as { state?: { mode?: 'edit' | string; post?: { post_id?: string } } };

  // 취소: 내용 비우고 이동
  const handleCancel = () => {
    // 1) 내용 초기화
    setCategory('');            // 또는 기본 카테고리로
    setTitle('');
    handleEditorChange('');     // 본문 비우기
    clearTags();
    setTagInput('');
    clearImages();              // 이미지/프리뷰/대표 초기화

    // 2) 이동(뒤로가기 → 폴백)
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    const postId = location.state?.post?.post_id;
    if (location.state?.mode === 'edit' && postId) {
      navigate(`/community/detail/${postId}`);
    } else {
      navigate('/community');
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
          className="px-5 py-2 rounded-xl border border-gray-300 bg-white text-sm hover:bg-gray-50 cursor-pointer"
          onClick={handleCancel}
        >
          취소
        </button>
        <button
          type="button"
          onClick={async () => {
            if (typeof onSave === 'function') {
              await onSave(); // 수정 모드: 기존 로직 유지(상세로 이동)
              return;
            }
            const ok = await handleSave(); // 신규: 성공 여부 확인
            if (!ok) {
              // 실패: 토스트만 띄우고 현재 페이지 유지
              return;
            }
            // 성공: /community 이동
            navigate('/community');
          }}
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
