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
