import TextEditor from '@/component/community/TextEditor';
import { useCommunityForm } from '@/hook/community/useCommunityForm';
import { useCommunityStore } from '@/pages/community/write/store/useCommunityStore';
import React from 'react';
import { createCommunityPost } from '@/supabase/community/communityCreate';
import TagInput from '@/component/TagInput';

function LeftContent() {
  const {
    category, setCategory,
    title, setTitle,
    body, setBody,

    tagInput, setTagInput,
    addTag, tags, removeTag, clearTags,

    addImages,
  } = useCommunityForm();

  const [isSaving, setIsSaving] = React.useState(false);
  const clearImages = useCommunityStore((s) => s.clearImages);
  const getStoreState = () => useCommunityStore.getState();

  console.log(getStoreState);
  // 이미지 동기화
  const removeImageAt = useCommunityStore((s) => s.removeImageAt);
  const getImageUrls = () => useCommunityStore.getState().imageUrls || [];

  // left 변경 시: 본문에 더 이상 존재하지 않는 store 이미지를 찾아 삭제
  const handleEditorChange = (html: string) => {
    setBody(html);

    // 본문에 남아있는 <img> src 목록 수집
    let doc: Document | null = null;
    try {
      doc = new DOMParser().parseFromString(html || '', 'text/html');
    } catch {
      doc = null;
    }
    const presentSrcs = doc
      ? Array.from(doc.querySelectorAll('img')).map((img) => img.getAttribute('src') || '')
      : [];

    // 스토어에 있는 imageUrls 중 본문에 없는 항목 인덱스 수집
    const storeUrls = getImageUrls();
    const toRemove = storeUrls
      .map((u, i) => ({ u, i }))
      .filter(({ u }) => u && !presentSrcs.includes(u))
      .map(({ i }) => i)
      .sort((a, b) => b - a);

    // 인덱스 역순으로 삭제 호출
    toRemove.forEach((idx) => {
      if (typeof removeImageAt === 'function') removeImageAt(idx);
    });
  };

  // 1) 스토어 addImages로 썸네일/대표선택 데이터 업데이트
  // 2) 추가된 URL들을 에디터에 삽입(중복 createObjectURL 방지 위해 스토어에서 가져옴)
  const handleInsertImages = async (files: File[]) => {
    const before = useCommunityStore.getState().imageUrls.length;
    addImages(files, 5);
    const all = useCommunityStore.getState().imageUrls;
    const added = all.slice(before); // 방금 추가된 항목들
    return added; // 에디터에 삽입할 URL 배열
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // const data = getStoreState();
      await createCommunityPost({
        title,
        body,
        // files: data.imageFiles ?? [],
        // storeImageUrls: data.imageUrls ?? [],
        // primaryIdx: data.primaryIdx ?? 0,
        category,
        tags,
        userId: undefined,
        // uploadOptions: { concurrency: 4, rollbackOnFail: true },
      });

      // 저장 성공: 스토어의 blob 정리 및 초기화
      if (typeof clearImages === 'function') clearImages();
      // 폼 초기화
      setTitle('');
      setBody('');
      setTagInput('');
      // 태그 모두 제거
      try {
        (tags || []).slice().forEach((t: any) => removeTag(t));
      } catch {}
      window.alert('게시가 완료되었습니다.');
      // 필요 시 리다이렉트 또는 폼 리셋 추가
    } catch (err: any) {
      console.error('Save error', err);
      window.alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const preventFormSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault();
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
        onChange={handleEditorChange} // 변경 시 스토어와 동기화
        onInsertImages={handleInsertImages}
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
