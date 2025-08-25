import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import CommunityWrite from "@/pages/community/write/CommunityWrite";

/* Code Splitting */
const Root = lazy(() => import('@/pages'));

export const routes = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      {
        path: 'community/write',
        element: <CommunityWrite />,
      },
    ],
  },
]);
