import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import CommunityWrite from "@/pages/community/CommunityWrite";

/* Code Splitting */
const Root = lazy(() => import('@/pages'));
const MyPageLayout = lazy(() => import('@/pages/MyPage/MyPageLayout'));

export const routes = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [

      // MyPage route
      {
        path: 'my-page',
        Component: MyPageLayout,
      },
      {
        path: 'community/write',
        element: <CommunityWrite />,
      },
    ]
  }
]);