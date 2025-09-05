import Footer from '@/component/Footer';
import Header from '@/component/Header';
import ScrollToTop from '@/hook/ScrolToTop';
import { Outlet } from 'react-router';

function Root() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <header>
        <Header />
      </header>
      <main className="flex-1">
        <Outlet></Outlet>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
export default Root;
