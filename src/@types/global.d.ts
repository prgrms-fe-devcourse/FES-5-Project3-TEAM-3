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
