import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import CommunityWrite from '@/pages/community/write/CommunityWrite';

/* Code Splitting */
const Root = lazy(() => import('@/pages'));
const MainPage = lazy(() => import('@/pages/MainPage/MainPage'));
const MyPageLayout = lazy(() => import('@/pages/MyPage/MyPageLayout'));
const Login = lazy(() => import('@/pages/Login/Login'));
const Register = lazy(() => import('@/pages/Login/Register'));
const Wines = lazy(() => import('@/pages/wine/Wines'));

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
        path: 'account',
        children: [
          {
            path: 'login',
            Component: Login,
          },
          {
            path: 'register',
            Component: Register,
          },
        ],
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
      { path: '/wines', Component: Wines },
    ],
  },
]);
