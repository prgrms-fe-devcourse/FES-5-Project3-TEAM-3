export default function RightPreview() {
  return (
    <>
      {/* 오른쪽 Preview */}
      <aside className="col-span-6 lg:col-span-6">
        <div className="sticky top-24">
          <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm ">
            {/* 이미지 미리보기 */}
            <div className="aspect-auto w-full flex items-center justify-center text-sm text-gray-400 bg-gray-50">
              이미지 미리보기
            </div>

            {/* 썸네일 대표 이미지 선택 */}
            <div className="mt-3 flex gap-2 overflow-x-auto">
              썸네일 대표 이미지 선택
              <div className="w-20 h-12 rounded-md overflow-hidden border">
                <img className="w-full h-full object-cover cursor-pointer" />
                <button
                  type="button"
                  className="absolute translate-y-[-8px] translate-x-[8px] text-xs text-red-600"
                  aria-label="이미지 삭제"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 카테고리 + 제목 */}
            <div className="p-5">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                  text-white bg-[#27AE60]"
                >
                  리뷰
                </span>
                <h2 className="text-xl font-semibold text-gray-800">게시물 제목</h2>
              </div>

              {/* 게시물 내용 */}
              <ul className="mt-4 space-y-1 text-sm text-gray-600">
                <li>내용 들어갈 자리</li>
              </ul>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
