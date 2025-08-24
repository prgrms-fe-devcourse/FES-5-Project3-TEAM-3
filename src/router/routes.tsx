import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';

/* Code Splitting */
const Root = lazy(() => import('@/pages'));

export const routes = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [],
  },
]);
