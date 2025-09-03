import type { Badge } from '@/assets/badgeCatalog';

interface BadgeCardProps {
  badge: Badge;
  earned: boolean;
}

function BadgeCard({ badge, earned }: BadgeCardProps) {
  const src = `/badge/${badge.code}.png`;

  return (
    <div
      className="relative flex flex-col items-center gap-2 w-40"
      aria-disabled={!earned}
      aria-label={`${badge.title}${earned ? '' : ' (locked)'}`}
      title={badge.conditionKo}
    >
      <img
        src={src}
        alt={badge.title}
        className={[
          'size-40 object-fill transition-all duration-200',
          earned ? 'grayscale-0 opacity-100' : 'grayscale brightness-100 opacity-30',
        ].join(' ')}
        loading="lazy"
        decoding="async"
      />
      {!earned && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="rounded-full bg-white/80 backdrop-blur-[1px] p-1 text-sm">🔒</span>
        </div>
      )}

      <span
        className={['text-center', earned ? 'text-text-primary' : 'text-text-secondary'].join(' ')}
      >
        {badge.title}
      </span>
    </div>
  );
}
export default BadgeCard;
