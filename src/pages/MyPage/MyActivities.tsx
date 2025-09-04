import Pagination from '@/component/Pagination';
import Spinner from '@/component/Spinner';
import { useMyPosts } from '@/hook/myPage/useMyPosts';
import useToast from '@/hook/useToast';
import { useAuth } from '@/store/@store';
import { useState } from 'react';
// import Card from '../community/Main/Card';
import { useMyLikedPosts } from '@/hook/myPage/useMyLikedPosts';
import Button from '@/component/Button';
import { MemoCard } from './MemoCard';
import tw from '@/utils/tw';

type Mode = 'written' | 'liked';

function MyActivities() {
  const [mode, setMode] = useState<Mode>('written');
  const [pageWritten, setPageWritten] = useState(1);
  const [pageLiked, setPageLiked] = useState(1);
  const pageSize = 6;

  const userId = useAuth((s) => s.userId);
  const isAuthLoading = useAuth((s) => s.isLoading);

  const w = useMyPosts(userId ?? undefined, pageWritten, pageSize, { enabled: mode === 'written' });
  const l = useMyLikedPosts(userId ?? undefined, pageLiked, pageSize, {
    enabled: mode === 'liked',
  });

  const active = mode === 'written' ? w : l;

  let content: React.ReactNode = null;

  if (isAuthLoading || (active.loading && active.data.rows.length === 0)) {
    content = <Spinner />;
  } else if (active.error) {
    useToast('error', '데이터를 불러오는 데 실패했습니다.');
    content = <p className="text-error-500">데이터를 불러오지 못했습니다.</p>;
  } else if (active.data && active.data.rows.length === 0) {
    content = (
      <p className="text-text-secondary">
        {mode === 'written'
          ? '아직 작성하신 게시글이 없습니다.'
          : '아직 좋아요한 게시글이 없습니다.'}
      </p>
    );
  } else if (active.data) {
    content = active.data.rows.map((post) => <MemoCard key={post.post_id} post={post} />);
  }

  return (
    <div className="flex flex-col gap-12 overflow-scroll">
      <h2 className="w-full inline-flex flex-col justify-start items-start text-2xl font-semibold">
        My Activities
      </h2>
      <div
        role="tablist"
        aria-label="My activity tabs"
        className="flex gap-4 w-full justify-center items-center px-auto"
      >
        <Button
          role="tab"
          aria-selected={mode === 'written'}
          size="lg"
          color="primary"
          borderType={mode === 'written' ? 'solid' : 'outline'}
          onClick={() => setMode('written')}
          className="w-3/8"
        >
          My Posts
        </Button>
        <Button
          role="tab"
          aria-selected={mode === 'liked'}
          size="lg"
          color="primary"
          borderType={mode === 'liked' ? 'solid' : 'outline'}
          onClick={() => setMode('liked')}
          className="w-3/8"
        >
          Liked Posts
        </Button>
      </div>
      <div
        role="tabpanel"
        aria-labelledby="tab-written"
        className={tw('flex flex-col gap-6', mode !== 'written' && 'hidden')}
      >
        <div className="grid grid-cols-3 gap-6 min-h-[300px]">{content}</div>
        <Pagination
          page={pageWritten}
          onPageChange={setPageWritten}
          totalPages={Math.ceil(w.data.total / pageSize)}
          showPrevNext
          size="md"
        />
      </div>
      <div
        role="tabpanel"
        aria-labelledby="tab-liked"
        className={tw('flex flex-col gap-12', mode !== 'liked' && 'hidden')}
      >
        <div className="grid grid-cols-3 gap-6 min-h-[300px]">{content}</div>
        <Pagination
          page={pageLiked}
          onPageChange={setPageLiked}
          totalPages={Math.ceil(l.data.total / pageSize)}
          showPrevNext
          size="md"
        />
      </div>
    </div>
  );
}
export default MyActivities;
