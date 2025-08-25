import MainPage from "@/pages/MainPage";
import { lazy } from "react";
import { createBrowserRouter } from "react-router";

/* Code Splitting */
const Root = lazy(() => import('@/pages/index'));

export const routes = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [{
      index: true,
      Component: MainPage
    }]
  }
])
