import LeftContent from '@/pages/community/write/LeftContent';
import RightPreview from '@/pages/community/write/RightPreview';

function CommunityWrite() {
  return (
    <div className="min-h-full">
      <div className="max-w-[84rem] ml-60 px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">커뮤니티 글쓰기</h1>
          <p className="text-sm text-gray-500 mt-1">
            카테고리·제목·이미지·태그를 채우면 오른쪽에서 실시간 미리보기가 업데이트돼요.
          </p>
        </header>

        <form className="grid grid-cols-12 gap-8">
          <LeftContent />

          <RightPreview />
        </form>
      </div>
    </div>
  );
}
export default CommunityWrite;
