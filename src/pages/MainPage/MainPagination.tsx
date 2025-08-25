// VerticalPagination.tsx
import React, { useCallback, useMemo } from 'react';

type Side = 'right' | 'left' | 'none';

export interface VerticalPaginationProps {
  total: number;
  active: number;
  onSelect: (index: number) => void;
  side?: Side;
  gapClassName?: string;
  className?: string;

  // 기본(비활성) 크기
  barWidth: number;
  barHeight: number;

  // 활성 크기(미지정 시 기본값 사용)
  barActiveWidth?: number;
  barActiveHeight?: number;

  getLabel?: (index: number) => string;
  dotClassName?: string; // 비활성 막대 스타일
  activeDotClassName?: string; // 활성 막대 스타일
}

export default function VerticalPagination({
  total,
  active,
  onSelect,
  side = 'right',
  gapClassName = 'gap-3',
  className = '',
  barHeight,
  barWidth,
  barActiveHeight,
  barActiveWidth,
  getLabel = (i) => `항목 ${i + 1}`,
  dotClassName = 'bg-white/40 hover:bg-white/60',
  activeDotClassName = 'bg-white',
}: VerticalPaginationProps) {
  if (total <= 1) return null;

  // 막대 크기 계산
  const iw = barWidth; // inactive width
  const ih = barHeight; // inactive height
  const aw = barActiveWidth ?? iw; // active width
  const ah = barActiveHeight ?? ih; // active height

  const positionClass = useMemo(() => {
    if (side === 'none') return '';
    const sideClass = side === 'right' ? 'right-4' : 'left-4';
    return `absolute ${sideClass} top-1/2 -translate-y-1/2`;
  }, [side]);

  const onKey = useCallback(
    (e: React.KeyboardEvent<HTMLUListElement>) => {
      if (total <= 1) return;
      if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        onSelect(Math.max(0, active - 1));
      } else if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(e.key)) {
        e.preventDefault();
        onSelect(Math.min(total - 1, active + 1));
      } else if (e.key === 'Home') {
        e.preventDefault();
        onSelect(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        onSelect(total - 1);
      }
    },
    [active, onSelect, total]
  );

  return (
    <ul
      role="tablist"
      aria-orientation="vertical"
      className={`${positionClass} ${gapClassName} z-20 flex flex-col ${className}`}
      onKeyDown={onKey}
    >
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === active
        const outerStyle: React.CSSProperties = { width: aw, height: ah };
        const scaleX = iw ? aw / iw : 1;
        const scaleY = ih ? ah / ih : 1;

        return (
          <li key={i}>
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={getLabel(i)}
              onClick={() => onSelect(i)}
              className="relative flex items-center justify-center
              cursor-pointer
              outline-none focus:outline-none focus:ring-0
              focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2"
              style={outerStyle}
            >
              <span
                className={[
                  'block rounded will-change-transform transition-transform duration-200 ease-out',
                  isActive ? activeDotClassName : dotClassName,
                ].join(' ')}
                style={{
                  width: iw,
                  height: ih,
                  transform: isActive ? `scale(${scaleX}, ${scaleY})` : 'scale(1,1)',
                }}
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
