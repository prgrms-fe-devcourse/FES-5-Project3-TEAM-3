import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import CommunityWrite from "@/pages/community/write/CommunityWrite";

/* Code Splitting */
const Root = lazy(() => import('@/pages'));
const MyPageLayout = lazy(() => import('@/pages/MyPage/MyPageLayout'));

export const routes = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
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

