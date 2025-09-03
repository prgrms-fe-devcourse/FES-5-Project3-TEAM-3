import { BADGE_CATALOG } from '@/assets/badgeCatalog';
import BadgeCard from '@/component/MyPage/BadgeCard';
import Spinner from '@/component/Spinner';
import { useMyBadges } from '@/hook/myPage/useMyBadges';
import useToast from '@/hook/useToast';

function MyAchievement() {
  const { badges, loading, error } = useMyBadges({ refreshOnMount: true });

  let content = null;
  if (loading) {
    content = <Spinner />;
  } else if (error) {
    useToast('error', '데이터를 불러오는 데 실패했습니다.');
    console.error(error);
    content = <p className="text-error-500">데이터를 불러오지 못했습니다.</p>;
  }

  const earnedSet = new Set(badges);
  const earnedCount = BADGE_CATALOG.filter((b) => earnedSet.has(b.title)).length;

  content = BADGE_CATALOG.map((b) => (
    <>
      <BadgeCard key={b.code} badge={b} earned={earnedSet.has(b.title)} />
    </>
  ));

  return (
    <div className="flex flex-col gap-6 overflow-scroll">
      <h2 className="w-full inline-flex flex-col justify-start items-start text-2xl font-semibold">
        My Achievements
      </h2>
      <h3 className="w-full inline-flex flex-col justify-start items-start font-light text-text-secondary">
        전체 {BADGE_CATALOG.length} 개 중 {earnedCount} 개를 획득하셨습니다.
      </h3>
      <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {content}
      </section>
    </div>
  );
}
export default MyAchievement;
