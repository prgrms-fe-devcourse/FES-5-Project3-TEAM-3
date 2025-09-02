import Button from '@/component/Button';
import Card from '@/pages/community/Main/Card';
import { Link } from 'react-router';
import SkeletonCard from '@/pages/community/Main/SkeletonCard';
import ScrollToTopButton from '@/component/community/ScrollToTopButton';
import PopularLike from '@/pages/community/Main/PopularLike';
import { usePosts } from '@/hook/usePosts';
import { usePopularTags } from '@/hook/useTags';

function CommunityMain() {
  // 분리된 훅 사용
  const { posts, search, setSearch, fetchPosts, placeholders, debounceRef, sortBy, setSortBy } =
    usePosts();
  const { popular, globalTags, handleTagClick } = usePopularTags();

  return (
    <div className="min-h-full">
      <div className="max-w-[90rem] mx-auto">
        <div className="px-6 lg:px-10 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Community</h2>
            <div className="flex items-center gap-3 mr-88">
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    const v = e.target.value === 'likes' ? 'likes' : 'recent';
                    setSortBy(v);
                    // 즉시 재조회: 현재 검색어와 새 정렬 적용
                    fetchPosts(search, v);
                  }}
                  className="px-3 py-1 rounded-md border bg-white text-sm"
                >
                  <option value="recent">최신순</option>
                  <option value="likes">인기순</option>
                </select>
              </div>
              <Link to="/community/write">
                <Button type="button" size="sm" borderType="solid">
                  글쓰기
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex gap-8">
            <main className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts === null ? (
                  placeholders.map((i) => <SkeletonCard key={i} />)
                ) : posts.length === 0 ? (
                  <div className="col-span-full text-center text-gray-500">게시글이 없습니다.</div>
                ) : (
                  posts.map((p) => <Card key={p.post_id} post={p} />)
                )}
              </div>
            </main>

            <aside className="w-80">
              <div className="mb-6">
                <div className="mb-3">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (debounceRef.current) {
                          window.clearTimeout(debounceRef.current);
                          debounceRef.current = null;
                        }
                        fetchPosts(search);
                      }
                    }}
                    className="w-full rounded-full border-2 border-gray-600 px-4 py-2 text-sm hover:border-primary-500 focus:border-primary-500 focus:outline-none"
                    placeholder="검색어를 입력하세요 (제목 또는 내용)"
                  />
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold mb-2">인기글</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {popular === null ? (
                      // 로딩 플레이스홀더
                      Array.from({ length: 3 }).map((_, i) => (
                        <li key={i} className="flex justify-between opacity-50">
                          <span>로딩 중...</span>
                          <span className="text-gray-400">—</span>
                        </li>
                      ))
                    ) : popular.length === 0 ? (
                      <li className="text-gray-500">인기글이 없습니다.</li>
                    ) : (
                      popular.map((p) => (
                        <li key={p.post_id} className="flex justify-between items-center">
                          <Link
                            to={`/community/detail/${p.post_id}`}
                            className="text-left hover:underline"
                          >
                            {p.title
                              ? p.title.replace(/<[^>]+>/g, '').slice(0, 18) +
                                (p.title.length > 18 ? '...' : '')
                              : '제목 없음'}
                          </Link>
                          <PopularLike
                            postId={p.post_id}
                            like_count={p.like_count ?? 0}
                            detailLink={`/community/detail/${p.post_id}`}
                          />
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold mb-2">인기 태그</h4>
                <div className="flex flex-wrap gap-2">
                  {globalTags === null ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <span key={i} className="px-2 py-1 border rounded-full text-xs opacity-50">
                        —
                      </span>
                    ))
                  ) : globalTags.length === 0 ? (
                    <div className="text-sm text-gray-500">태그가 없습니다.</div>
                  ) : (
                    globalTags.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-400 text-sm text-primary-400 bg-white shadow-sm"
                        onClick={() => handleTagClick(t)}
                      >
                        # {t}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </aside>
          </div>
          {/* 우측 하단 "맨위로" 버튼 */}
          <ScrollToTopButton
            className="mr-100"
            onClick={() => {
              if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CommunityMain;
