import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';

/* Code Splitting */
const Root = lazy(() => import('@/pages'));
const MyPageLayout = lazy(() => import('@/pages/MyPage/MyPageLayout'));

export const routes = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [

      {
        path: 'my-page',
        Component: MyPageLayout,

      }
    ]
  }
])