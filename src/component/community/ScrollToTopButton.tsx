import { useEffect, useState } from 'react';

interface Props {
  onClick?: () => void;
  threshold?: number; // 보여줄 스크값(px)
  defaultBottom?: number; // 기본 bottom(px)
  margin?: number; // 푸터와 버튼 사이 여유(px)
  className?: string;
  ariaLabel?: string;
}

export default function ScrollToTopButton({
  onClick,
  threshold = 300,
  defaultBottom = 24,
  margin = 12,
  className = '',
  ariaLabel = '맨 위로 이동',
}: Props) {
  const [show, setShow] = useState(false);
  const [bottomOffset, setBottomOffset] = useState<number>(defaultBottom);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;

    const update = () => {
      // show 판단
      setShow(window.scrollY > threshold);

      // footer
      const footer = document.querySelector('footer');
      if (!footer) {
        setBottomOffset(defaultBottom);
      } else {
        const rect = footer.getBoundingClientRect();
        const overlap = Math.max(0, window.innerHeight - rect.top);
        setBottomOffset(defaultBottom + overlap + margin);
      }

      ticking = false;
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    // 초기 실행
    update();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [threshold, defaultBottom, margin]);

  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick();
      return;
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={handleClick}
      style={{ bottom: `${bottomOffset}px` }}
      className={`fixed right-6 z-50 rounded-full p-3 shadow-lg transition-opacity duration-200 ${
        show ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } bg-primary-400 text-white ${className}`}
    >
      <span className="sr-only">{ariaLabel}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
