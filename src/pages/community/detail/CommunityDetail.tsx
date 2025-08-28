import Button from '@/component/Button'

function CommunityDetail() {
  return (
    <div className="min-h-full">
      <div className="max-w-[90rem] mx-auto px-6 py-10">
        <div className="space-y-6">
          <article className="bg-white p-6 rounded-lg shadow-sm">
            <header className="mb-4">
              {/* 게시글 제목 */}
              <h1 className="text-2xl font-semibold text-gray-900">게시글 제목 예시</h1>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* 작성자 정보 */}
                  <img
                    src="/images/avatar-placeholder.png"
                    alt="작성자"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">이순신</p>
                    <p className="text-xs text-gray-400">2025-08-28 · 좋아요 10</p>
                  </div>
                </div>

                {/*
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      수정
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                      삭제
                    </button>
                  </div> */}
              </div>
            </header>

            {/* 게시글 본문 */}
            <div className="px-13 max-w-none text-gray-800">
              <p>여기에는 게시글 본문이 들어갑니다. 텍스트, 이미지 등</p>
              <figure>
                <img
                  src="/images/content-placeholder.jpg"
                  alt="대충 이미지 들어갈 자리"
                  className="rounded"
                />
              </figure>
            </div>
            {/* 게시글 태그 및 좋아요(하단) */}
            <footer className="px-12 mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-400 text-sm text-primary-400 bg-white shadow-sm">
                  와인 최고
                </span>

                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-400 text-sm text-primary-400 bg-white shadow-sm">
                  대충 와인 좋다고 하는 태그
                </span>
              </div>
              <button className="flex gap-2 py-1 text-sm cursor-pointer">
                <img src="/icon/like.svg" alt="좋아요" />
                <span className="mt-2">10</span>
              </button>
            </footer>
          </article>

          {/* 댓글 작성 폼 */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <form className="mb-6">
              <div className="flex gap-3">
                <textarea
                  id="comment"
                  className="block w-5/6 rounded border border-gray-800 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="댓글을 입력하세요."
                  rows={1}
                />
                <Button type="submit" size="md" borderType="outline" className="h-12.5">
                  등록
                </Button>
              </div>
            </form>

            {/* 댓글 목록 */}
            <ul className="space-y-4">
              <li className="flex gap-3">
                <img
                  src="/images/avatar-placeholder.png"
                  alt="댓글작성자"
                  className="w-9 h-9 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">댓글작성자1</span>
                      <span className="text-xs text-gray-400">2025년 08월 28일</span>

                      <button className="cursor-pointer">
                        <img src="/icon/modify.svg" alt="수정하기" className="w-3 h-3" />
                      </button>
                      <button className="cursor-pointer">
                        <img src="/icon/delete.svg" alt="삭제하기" className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 mb-1 text-sm text-gray-700">댓글 내용 예시입니다.</p>

                  <div className="flex gap-2">
                    <button className="flex gap-1 py-1 text-sm cursor-pointer">
                      <img src="/icon/like.svg" alt="좋아요" className="w-4 h-4 " />
                      <span>10</span>
                    </button>
                    <button className="flex gap-1 py-1 text-sm cursor-pointer">
                      <img src="/icon/comment.svg" alt="답글" className="w-4 h-4 " />
                      <span>2</span>
                    </button>
                    <button className="flex gap-1 py-1 text-sm cursor-pointer">
                      <span>답글</span>
                    </button>
                  </div>

                  {/* 답글 작성 폼 */}
                  <form
                    className="reply-form mt-3 pl-10 flex gap-3 items-start"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <textarea
                      name="reply"
                      className="w-5/6 rounded border border-gray-200 p-2 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      rows={2}
                      placeholder="답글을 입력하세요."
                    />
                    <div className="flex gap-2">
                      <Button type="submit" size="sm" borderType="outline">
                        등록
                      </Button>
                      <Button type="button" size="sm" borderType="outline">
                        취소
                      </Button>
                    </div>
                  </form>
                </div>
              </li>

              {/* 댓글 2 */}
              <li className="flex gap-3">
                <img
                  src="/images/avatar-placeholder.png"
                  alt="댓글작성자"
                  className="w-9 h-9 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">댓글작성자2</span>
                      <span className="text-xs text-gray-400">2025년 08월 28일</span>
                      <button className="cursor-pointer">
                        <img src="/icon/modify.svg" alt="수정하기" className="w-3 h-3" />
                      </button>
                      <button className="cursor-pointer">
                        <img src="/icon/delete.svg" alt="삭제하기" className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 mb-1 text-sm text-gray-700">댓글 내용 예시입니다.</p>
                  <div className="flex gap-2">
                    <button className="flex gap-1 py-1 text-sm cursor-pointer">
                      <img src="/icon/like.svg" alt="좋아요" className="w-4 h-4 " />
                      <span>10</span>
                    </button>
                    <button className="flex gap-1 py-1 text-sm cursor-pointer">
                      <img src="/icon/comment.svg" alt="답글" className="w-4 h-4 " />
                      <span>1</span>
                    </button>
                    <button className="flex gap-1 py-1 text-sm cursor-pointer">
                      <span>답글</span>
                    </button>
                  </div>

                  {/* 답글 작성 완료 폼 */}
                  <form
                    className="reply-form mt-3 pl-10 flex gap-3 items-start"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <img
                  src="/images/avatar-placeholder.png"
                  alt="댓글작성자"
                  className="w-9 h-9 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">댓글작성자2</span>
                      <span className="text-xs text-gray-400">2025년 08월 28일</span>
                      <button className="cursor-pointer">
                        <img src="/icon/modify.svg" alt="수정하기" className="w-3 h-3" />
                      </button>
                      <button className="cursor-pointer">
                        <img src="/icon/delete.svg" alt="삭제하기" className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 mb-1 text-sm text-gray-700">댓글 내용 예시입니다.</p>
                  <div className="flex gap-2">
                    <button className="flex gap-1 py-1 text-sm cursor-pointer">
                      <img src="/icon/like.svg" alt="좋아요" className="w-4 h-4 " />
                      <span>10</span>
                    </button>
                    <button className="flex gap-1 py-1 text-sm cursor-pointer">
                      <img src="/icon/comment.svg" alt="답글" className="w-4 h-4 " />
                      <span>1</span>
                    </button>
                    <button className="flex gap-1 py-1 text-sm cursor-pointer">
                      <span>답글</span>
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </li>
        </ul>
      </section>
        </div>
      </div>
    </div>
  );
}
export default CommunityDetail
