import Footer from '@/component/Footer';
import Header from '@/component/Header';
import ScrollToTop from '@/hook/ScrolToTop';
import { Outlet } from 'react-router';

function Root() {
  return (
    <div className="flex flex-col max-w-screen h-screen">
      <ScrollToTop />
      <header>
        <Header />
      </header>
      <main>
        <Outlet></Outlet>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
export default Root;
