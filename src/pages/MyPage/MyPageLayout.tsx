import MyPageNav from '@/component/MyPage/MyPageNav';
import { routes } from '@/router/routes';
import { Outlet } from 'react-router';

function MyPageLayout() {
  const root = routes.routes[0];
  const myPageRoute = root.children?.find((route) => route.path === 'my-page');

  const myPageChildren = myPageRoute?.children ?? [];

  return (
    <div className="myPageContainer flex min-h-screen">
      <aside className="myPageSideBar">
        <MyPageNav routes={myPageChildren} basePath="/my-page" />
      </aside>
      <section className="myPageContent flex-1">
        <Outlet />
      </section>
    </div>
  );
}
export default MyPageLayout;
