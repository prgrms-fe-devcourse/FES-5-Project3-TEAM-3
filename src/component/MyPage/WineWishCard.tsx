import ReviewRatings from '../wine/wineDetailInfo/wineReview/ReviewRatings';
import { useEffect, useMemo, useState } from 'react';
import tw from '@/utils/tw';
import { Link } from 'react-router';

const FALLBACK_IMG = '/image/wineImage.svg';

interface WineWishCardProps {
  wine_id: string;
  name: string;
  imageUrl: string;
  country: string | null;
  abv: string | null;
  rating: number;
  bookmarked: boolean;
  onToggleBookmark: (wine_id: string, next: boolean) => void;
}

function WineWishCard({
  wine_id,
  name,
  imageUrl,
  country,
  abv,
  rating,
  bookmarked,
  onToggleBookmark,
}: WineWishCardProps) {
  const bookmarkFalse = '/icon/bookmark.svg';
  const bookmarkTrue = '/icon/bookmarkFilled.svg';

  const imageSrc = imageUrl ?? FALLBACK_IMG;
  const to = `/wines/detail/${wine_id}`;

  const [isOverflow, setIsOverflow] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (name.length > 10) {
      setIsOverflow(true);
    }
  }, [name]);

  const { shiftPx, durationMs } = useMemo(() => {
    const extra = Math.max(0, name.length - 10);
    return {
      shiftPx: -Math.max(extra * 8, 100),
      durationMs: Math.min(9000, Math.max(1200, 1200 + extra * 120)),
    };
  }, [name]);

  return (
    <Link
      to={to}
      className={[
        'w-42 bg-secondary-100 border border-secondary-500 rounded-lg shadow-md flex flex-col gap-4 items-center px-4 py-5 relative overflow-hidden',
        'transition-all duration-200 ease-out',
        'hover:bg-secondary-200/70 hover:shadow-lg',
        'motion-safe:hover:translate-y-0.5 motion-safe:hover:scale-[1.01]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-700/80',
      ].join(' ')}
    >
      {/* bookmark button */}
      <button
        type="button"
        className="absolute top-2 right-2 size-4"
        onClick={() => onToggleBookmark(wine_id, !bookmarked)}
      >
        {bookmarked ? (
          <img src={bookmarkTrue} alt="북마크" className="size-full object-cover" />
        ) : (
          <img src={bookmarkFalse} alt="북마크 취소" className="size-full object-cover" />
        )}
      </button>

      <h3
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-label={name}
        title={name}
        className={tw(
          'w-full text-lg font-semibold text-text-primary text-center',
          isOverflow
            ? hover
              ? `text-left whitespace-nowrap transform transition-transform ease-linear`
              : 'translate-x-0  overflow-hidden truncate whitespace-nowrap'
            : 'text-center'
        )}
        style={
          hover
            ? {
                transform: `translateX(${shiftPx}px)`,
                transitionDuration: `${durationMs}ms`,
              }
            : undefined
        }
      >
        {name}
      </h3>
      <img src={imageSrc} alt={name} className="w-20 h-40 object-contain" />
      <p className="text-xs text-text-secondary">
        {country ?? 'Country : -'} | {abv ?? 'ABV : -'}
      </p>
      <ReviewRatings rating={rating} type="readonly" w="w-5" h="h-5" />
    </Link>
  );
}
export default WineWishCard;
