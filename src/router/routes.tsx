import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import CommunityWrite from '@/pages/community/write/CommunityWrite';

/* Code Splitting */
const Root = lazy(() => import('@/pages'));
const MainPage = lazy(() => import('@/pages/MainPage/MainPage'));
const MyPageLayout = lazy(() => import('@/pages/MyPage/MyPageLayout'));

export const routes = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      {
        index: true,
        Component: MainPage,
      },
      {
        path: 'community/write',
        element: <CommunityWrite />,
      },
      // MyPage route
      {
        path: 'my-page',
        Component: MyPageLayout,
      },
    ],
  },
]);
