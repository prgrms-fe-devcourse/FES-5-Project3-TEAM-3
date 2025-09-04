import type { PaginationItem, PaginationSize, UsePaginationOptions } from '@/@types/global';
import { usePagination } from '@/hook/usePagination';
import { scrollToTopPage } from '@/utils/scrollToTopPage';
import tw from '@/utils/tw';
import { Fragment, useCallback, useEffect, useState } from 'react';

type PaginationProps = UsePaginationOptions & {
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  size?: PaginationSize;
  disabled?: boolean;
  className?: string;
  itemRenderer?: (
    item: PaginationItem,
    defaultNode: React.ReactNode,
    onClick: () => void
  ) => React.ReactNode;
  ariaLabel?: string;
  scrollOnChange?: ScrollBehavior;
  scrollContainer?: string | React.RefObject<HTMLElement>;
};

function Pagination({
  page: controlledPage,
  defaultPage = 1,
  totalPages,
  onPageChange,
  size = 'md',
  disabled = false,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  className = '',
  itemRenderer,
  ariaLabel = 'Pagination',
  scrollOnChange = 'auto',
  scrollContainer,
}: PaginationProps) {
  // 페이지가 한 장 뿐이면 표시하지 않음
  if (totalPages < 2) return null;

  const [uncontrolledPage, setUncontrolledPage] = useState(defaultPage);
  const [nextPage, setNextPage] = useState<number | null>(null);

  const isControlled = typeof controlledPage === 'number';

  const page = isControlled ? (nextPage ?? (controlledPage as number)) : uncontrolledPage;

  const clamp = useCallback((n: number) => Math.max(1, Math.min(totalPages, n)), [totalPages]);

  const setPage = useCallback(
    (next: number) => {
      const n = clamp(next);
      if (isControlled) {
        setNextPage(n);
      } else {
        setUncontrolledPage(n);
      }
      onPageChange?.(n);

      requestAnimationFrame(() => {
        scrollToTopPage(scrollContainer, scrollOnChange);
      });
    },
    [isControlled, clamp, onPageChange, scrollOnChange, scrollContainer]
  );

  useEffect(() => {
    if (!isControlled) return;
    if (nextPage !== null && controlledPage === nextPage) {
      setNextPage(null);
    }
  }, [controlledPage, nextPage, isControlled]);

  const items = usePagination({
    page,
    totalPages,
    siblingCount,
    boundaryCount,
    showFirstLast,
    showPrevNext,
  });

  // keyboard event binding
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (disabled) return;

      if (e.key === 'ArrowLeft') {
        setPage(page - 1);
      } else if (e.key === 'ArrowRight') {
        setPage(page + 1);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [page, setPage, disabled]);

  const sizeClasses = {
    sm: 'h-8 min-w-8 text-sm px-2',
    md: 'h-9 min-w-9 text-sm px-3',
    lg: 'h-10 min-w-10 text-base px-4',
  };

  const renderContent = (item: PaginationItem) => {
    switch (item.type) {
      case 'first':
        return (
          <div aria-hidden className="inline-flex gap-1">
            <img src="/icon/leftChevronDouble.svg" alt="first" />
            <span>First</span>
          </div>
        );
      case 'prev':
        return (
          <div aria-hidden className="inline-flex gap-1">
            <img src="/icon/leftChevron.svg" alt="back" />
            <span>Back</span>
          </div>
        );
      case 'next':
        return (
          <div aria-hidden className="inline-flex gap-1">
            <img src="/icon/rightChevron.svg" alt="next" />
            <span>Next</span>
          </div>
        );
      case 'last':
        return (
          <div aria-hidden className="inline-flex gap-1">
            <img src="/icon/rightChevronDouble.svg" alt="last" />
            <span>Last</span>
          </div>
        );
      case 'ellipsis':
        return (
          <span className="px-2" aria-hidden>
            ...
          </span>
        );
      case 'page':
      default:
        return item.page;
    }
  };

  const labelForItem = (item: PaginationItem) => {
    switch (item.type) {
      case 'first':
        return '첫 번째 페이지로 이동합니다.';
      case 'prev':
        return '이전 페이지로 이동합니다.';
      case 'next':
        return '다음 페이지로 이동합니다.';
      case 'last':
        return '마지막 페이지로 이동합니다.';
      case 'ellipsis':
        return '더 많은 페이지';
      case 'page':
      default:
        return item.selected
          ? `현재 ${item.page} 페이지입니다.`
          : `${item.page} 페이지로 이동합니다.`;
    }
  };

  return (
    <div className="w-full flex justify-center">
      <nav aria-label={ariaLabel} className={tw('inline-flex items-center gap-2', className)}>
        {items.map((item) => {
          const selected = !!item.selected;
          const isButton = item.type !== 'ellipsis';
          const label = labelForItem(item);

          const base = (
            <button
              type="button"
              aria-label={label}
              aria-current={selected ? 'page' : undefined}
              disabled={disabled || !!item.disabled || !isButton}
              onClick={() => isButton && item.page && setPage(item.page)}
              className={tw(
                'inline-flex items-center justify-center rounded-xl border cursor-pointer',
                // 'transition-colors duration-150',
                'select-none whitespace-nowrap',
                sizeClasses[size],
                selected
                  ? 'bg-primary-500 text-secondary-50 border-transparent shadow'
                  : 'bg-secondary-50 text-text-primary border-slate-400',
                (disabled || item.disabled) && !selected
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-secondary-100'
              )}
            >
              {renderContent(item)}
            </button>
          );

          if (itemRenderer) {
            return (
              <Fragment key={item.key}>
                {itemRenderer(item, base, () => item.page && setPage(item.page))}
              </Fragment>
            );
          }

          return <Fragment key={item.key}>{base}</Fragment>;
        })}
      </nav>
    </div>
  );
}
export default Pagination;
