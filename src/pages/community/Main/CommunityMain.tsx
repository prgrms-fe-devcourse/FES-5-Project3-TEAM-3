import { useEffect, useState } from 'react';
import Button from '@/component/Button';
import Card from '@/pages/community/Main/Card';
import { Link } from 'react-router';
import supabase from '@/supabase/supabase';
import type { Database } from '@/supabase/database.types';
import SkeletonCard from '@/pages/community/Main/SkeletonCard';

type PostRow = Database['public']['Tables']['posts']['Row'];

// profile join 결과 타입 정의
type ProfileJoined = {
  nickname?: string | null;
  profile_image_url?: string | null;
};

type PostWithProfile = PostRow & { profile?: ProfileJoined | null };

function CommunityMain() {
  const [posts, setPosts] = useState<PostWithProfile[] | null>(null); // null = loading
  const placeholders = Array.from({ length: 9 }).map((_, i) => i);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profile(nickname, profile_image_url)') // join
        .order('created_at', { ascending: false }) // 최신순 정렬
        .limit(30);

      if (!mounted) return;
      if (error) {
        console.error('fetch posts error', error);
        setPosts([]);
        return;
      }
      // data는 PostWithProfile[] 형태로 들어옴
      setPosts((data ?? []) as PostWithProfile[]);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-full">
      <div className="max-w-[90rem] mx-auto">
        <div className="px-6 lg:px-10 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Community</h2>
            <div className="flex items-center gap-3 mr-88">
              <button className="px-4 py-2 bg-white border rounded-md text-sm">전체 보기 ▾</button>
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
                {posts === null
                  ? placeholders.map((i) => <SkeletonCard key={i} />)
                  : posts.length === 0
                  ? <div className="col-span-full text-center text-gray-500">게시글이 없습니다.</div>
                  : posts.map((p) => <Card key={p.post_id} post={p} />)}
              </div>
            </main>

            <aside className="w-80">
              <div className="mb-6">
                <div className="mb-3">
                  <input
                    className="w-full rounded-full border px-4 py-2 text-sm"
                    placeholder="검색어를 입력하세요"
                  />
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold mb-2">인기글</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex justify-between">
                      <span>게시글 제목 예시 A</span>
                      <span className="text-gray-400">100</span>
                    </li>
                    <li className="flex justify-between">
                      <span>게시글 제목 예시 B</span>
                      <span className="text-gray-400">80</span>
                    </li>
                    <li className="flex justify-between">
                      <span>게시글 제목 예시 C</span>
                      <span className="text-gray-400">50</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold mb-2">인기 태그</h4>
                <div className="flex flex-wrap gap-2">
                  <button className="px-2 py-1 border rounded-full text-xs">#레드와인</button>
                  <button className="px-2 py-1 border rounded-full text-xs">#화이트와인</button>
                  <button className="px-2 py-1 border rounded-full text-xs">#로제와인</button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityMain;
