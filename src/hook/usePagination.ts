import type { PaginationItem, UsePaginationOptions } from '@/@types/global';
import { useMemo } from 'react';

function range(start: number, end: number): number[] {
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

export function usePagination(options: UsePaginationOptions): PaginationItem[] {
  const {
    page,
    totalPages,
    siblingCount = 1,
    boundaryCount = 1,
    showFirstLast = true,
    showPrevNext = true,
  } = options;

  return useMemo(() => {
    const items: PaginationItem[] = [];
    const clamp = (n: number) => Math.max(1, Math.min(totalPages, n));

    const startPages = range(1, Math.min(boundaryCount, totalPages));
    const endPages = range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages);

    const siblingsStart = Math.max(
      Math.min(page - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1),
      boundaryCount + 2
    );

    const siblingsEnd = Math.min(
      Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
      endPages.length > 0 ? endPages[0] - 2 : totalPages - 1
    );

    const addPage = (p: number) => {
      items.push({ key: `page-${p}`, type: 'page', page: p, selected: p === page });
    };

    if (showFirstLast) {
      items.push({ key: 'first', type: 'first', page: 1, disabled: page === 1 });
    }

    if (showPrevNext) {
      items.push({ key: 'prev', type: 'prev', page: clamp(page - 1), disabled: page === 1 });
    }

    startPages.forEach(addPage);

    if (siblingsStart > boundaryCount + 2) {
      items.push({ key: 'ellipsis-start', type: 'ellipsis' });
    } else if (boundaryCount + 1 < totalPages - boundaryCount) {
      addPage(boundaryCount + 1);
    }

    for (let p = siblingsStart; p <= siblingsEnd; p++) addPage(p);

    if (siblingsEnd < totalPages - boundaryCount - 1) {
      items.push({ key: 'ellipsis-end', type: 'ellipsis' });
    } else if (totalPages - boundaryCount > boundaryCount) {
      addPage(totalPages - boundaryCount);
    }

    endPages.forEach(addPage);

    if (showPrevNext) {
      items.push({
        key: 'next',
        type: 'next',
        page: clamp(page + 1),
        disabled: page === totalPages,
      });
    }

    if (showFirstLast) {
      items.push({ key: 'last', type: 'last', page: totalPages, disabled: page === totalPages });
    }

    return items;
  }, [page, totalPages, siblingCount, boundaryCount, showFirstLast, showPrevNext]);
}
