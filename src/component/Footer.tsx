import ScrollToTop from '@/hook/ScrolToTop';
import { NavLink } from 'react-router';

function Footer() {
  return (
    <div className="bg-secondary-100 w-full">
      <div className="w-full max-w-[90rem] mx-auto px-4 md:px-10 py-6 lg:py-8 flex flex-col lg:flex-row justify-between items-center gap-4">
        <h1 className="w-32 h-9 md:w-41.5 md:h-11.75 flex items-center pt-1">
          <NavLink to="/" onClick={ScrollToTop}>
            <img src="/image/Logo-Black.png" alt="로고아이콘" />
          </NavLink>
        </h1>
        <div className="flex flex-col gap-2 text-center lg:text-right">
          <p className="text-xs sm:text-sm text-primary-900">
            Copyright 2025 © Programmers DevCourse FE Team 3
          </p>
          <div className="flex gap-4 sm:gap-8 justify-center lg:justify-end">
            <div className="flex gap-2 items-center">
              <img className="w-5 h-5" src="/image/github.png" alt="깃허브" />
              <a
                className="text-primary-900 text-sm"
                href="https://github.com/prgrms-fe-devcourse/FES-5-Project3-TEAM-3"
              >
                GitHub
              </a>
            </div>
            <div className="flex gap-2 items-center">
              <img className="w-5 h-5" src="/image/programmers.png" alt="프로그래머스" />
              <a className="text-primary-900 text-sm" href="https://programmers.co.kr/">
                Programmers
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
