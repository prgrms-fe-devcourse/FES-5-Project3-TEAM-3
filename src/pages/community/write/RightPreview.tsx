import { useCommunityPreview } from '@/hook/community/useCommunityPreview';

function RightPreview() {
  const {
    imageUrls = [],
    removeImageAt,
    setPreviewIndex,
    setPrimaryIdx,
    category,
    title,
    body,
    previewIndex = 0,
  } = useCommunityPreview();

  const handleDeleteAt = (idx: number) => {
    removeImageAt && removeImageAt(idx);
  };

  const handleSelect = (idx: number) => {
    setPreviewIndex(idx);
    setPrimaryIdx(idx);
  };

  const hasImages = Array.isArray(imageUrls) && imageUrls.length > 0;
  const mainSrc = hasImages ? imageUrls[previewIndex] : '';

  const categoryMap: Record<string, string> = {
    review: 'bg-[#27AE60]',
    free: 'bg-primary-400',
    question: 'bg-gray-700',
  };
  const badgeClass = categoryMap[category] ?? 'bg-gray-400';
  const badgeLabel = category || '카테고리';

  console.log(setPrimaryIdx);
  console.log(previewIndex);

  // 1. 이미지 슬라이드 ex 인스타 스타일.
  // 태그 미리보기 없어도 괜찮아 보임.

  return (
    <aside className="col-span-6 lg:col-span-6">
      <div className="sticky top-24">
        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
          {hasImages ? (
            <div className="bg-gray-50">
              <img
                className="w-[680px] h-[380px] object-cover"
                src={mainSrc}
                alt={`미리보기 ${previewIndex + 1}`}
              />
            </div>
          ) : (
            <div className="aspect-auto w-full flex items-center justify-center text-sm text-gray-400 bg-gray-50">
              이미지 미리보기
            </div>
          )}

          <div className="mt-3 px-2 flex gap-2 overflow-x-auto">
            {hasImages ? (
              imageUrls.map((url, idx) => (
                <div
                  key={idx}
                  className={`relative w-20 h-12 rounded-md overflow-hidden border ${idx === previewIndex ? 'ring-2 ring-primary-400' : ''}`}
                >
                  <img
                    className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform"
                    src={url}
                    alt={`썸네일 ${idx + 1}`}
                    onClick={() => handleSelect(idx)}
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 text-xs text-red-600 cursor-pointer bg-white/70 rounded-full px-1"
                    aria-label="이미지 삭제"
                    title="이미지 삭제"
                    onClick={() => handleDeleteAt(idx)}
                  >
                    ✖
                  </button>
                </div>
              ))
            ) : (
              <div className="w-20 h-12 flex items-center justify-center text-sm text-gray-400 bg-gray-50 rounded-md">
                썸네일 선택
              </div>
            )}
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${badgeClass}`}
              >
                {badgeLabel}
              </span>
              {title ? (
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              ) : (
                <h2 className="text-xl font-semibold text-gray-400">제목이 없습니다.</h2>
              )}
            </div>
            {
              body ? (
              <div
                className="mt-4 text-sm text-gray-900 whitespace-pre-wrap prose prose-sm max-w-none"
                // editor에서 생성된 HTML을 그대로 렌더링
                dangerouslySetInnerHTML={{ __html: body || '' }}
              />
              ) : (
                <p className="mt-4 text-sm text-gray-400">내용이 없습니다.</p>
              )}

          </div>
        </div>
      </div>
    </aside>
  );
}

export default RightPreview;
