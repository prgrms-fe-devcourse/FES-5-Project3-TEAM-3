import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import CommunityWrite from '@/pages/community/write/CommunityWrite';

/* Code Splitting */
const Root = lazy(() => import('@/pages'));
const MainPage = lazy(() => import('@/pages/MainPage/MainPage'));
const MyPageLayout = lazy(() => import('@/pages/MyPage/MyPageLayout'));

// MyPage 하위 페이지
const MyHome = lazy(() => import('@/pages/MyPage/MyHome'));
const WineSeller = lazy(() => import('@/pages/MyPage/WineSeller'));
const WishList = lazy(() => import('@/pages/MyPage/WishList'));
const MyActivities = lazy(() => import('@/pages/MyPage/MyActivities'));
const MyAchievement = lazy(() => import('@/pages/MyPage/MyAchievement'));
const Settings = lazy(() => import('@/pages/MyPage/Settings'));

const Login = lazy(() => import('@/pages/Login/Login'));
const Register = lazy(() => import('@/pages/Login/Register'));

const Wines = lazy(() => import('@/pages/wine/Wines'));

// MyPage 하위 페이지
const MyHome = lazy(() => import('@/pages/MyPage/MyHome'));
const WineSeller = lazy(() => import('@/pages/MyPage/WineSeller'));
const WishList = lazy(() => import('@/pages/MyPage/WishList'));
const MyActivities = lazy(() => import('@/pages/MyPage/MyActivities'));
const MyAchievement = lazy(() => import('@/pages/MyPage/MyAchievement'));
const Settings = lazy(() => import('@/pages/MyPage/Settings'));

const Login = lazy(() => import('@/pages/Login/Login'));
const Register = lazy(() => import('@/pages/Login/Register'));
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
        children: [
          {
            index: true,
            element: <Navigate to="home" replace />,
          },
          {
            path: 'home',
            Component: MyHome,
            handle: { label: 'Home', showInNav: true },
          },
          {
            path: 'wine-seller',
            Component: WineSeller,
            handle: { label: 'Wine Seller', showInNav: true },
          },
          {
            path: 'wish-list',
            Component: WishList,
            handle: { label: 'Wish List', showInNav: true },
          },
          {
            path: 'activity',
            Component: MyActivities,
            handle: { label: 'My Activities', showInNav: true },
          },
          {
            path: 'achievement',
            Component: MyAchievement,
            handle: { label: 'My Achievement', showInNav: true },
          },
          {
            path: 'settings',
            Component: Settings,
            handle: { label: 'Settings', showInNav: true },
          },
        ],
      },
      { path: '/wines', Component: Wines },
    ],
  },
]);
