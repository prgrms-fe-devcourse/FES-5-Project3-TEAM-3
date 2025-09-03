import type { RouteObject } from 'react-router';

export type NavItem = {
  path: string;
  label: string;
};

export type RouteWithHandle = RouteObject & {
  handle?: {
    label?: string;
    showInNav?: boolean;
  };
  children?: RouteWithHandle[];
};

export type ConfirmTone = 'default' | 'success' | 'danger';

export type ConfirmOptions = {
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  tone?: ConfirmTone;
  allowOutsideClose?: boolean;
  allowEscapeClose?: boolean;
  icon?: React.ReactNode;
  busy?: boolean;
};

export type Reply = Tables<'reply'>;
export type ReplyData = Reply & {
  profile: Pick<Tables<'profile'>, 'profile_id' | 'nickname' | 'profile_image_url'> | null;
};

export type PaginationSize = 'sm' | 'md' | 'lg';
export type PaginationItemType = 'first' | 'prev' | 'page' | 'ellipsis' | 'next' | 'last';

export type PaginationItem = {
  key: string;
  type: PaginationItemType;
  page?: number;
  selected?: boolean;
  disabled?: boolean;
};

export type UsePaginationOptions = {
  page: number; // current page index
  totalPages: number; // total page count
  siblingCount?: number; // current에서 보여줄 pagination 수
  boundaryCount?: number; // 시작~끝쪽에서 항상 보여줄 page 수
  showFirstLast?: boolean; // < first ... last > 보여줄지 여부
  showPrevNext?: boolean; // < prev ... next > 보여줄지 여부
};
