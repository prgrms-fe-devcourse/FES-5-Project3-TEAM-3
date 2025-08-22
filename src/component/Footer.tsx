import { NavLink } from 'react-router';

function Footer() {
  return (
    <div className="bg-secondary-100 h-31 w-full flex items-center justify-center">
      <div className="w-360 px-25 py-8 flex justify-between items-center">
        <h1 className="w-41.5 h-11.75 flex items-center pt-1">
          <NavLink to="/">
            <img src="/image/Logo-Black.png" alt="로고아이콘" />
          </NavLink>
        </h1>
        <div className="flex-col gap-2">
          <p className="text-sm text-primary-900">
            Copyright 2025 © Programmers DevCourse FE Team 3
          </p>
          <div className="flex gap-8 justify-end">
            <div className="flex gap-2 items-center">
              <img src="/image/github.png" alt="깃허브" />
              <a
                className="text-primary-900 text-sm"
                href="https://github.com/prgrms-fe-devcourse/FES-5-Project3-TEAM-3"
              >
                GitHub
              </a>
            </div>
            <div className="flex gap-2 items-center">
              <img src="/image/programmers.png" alt="프로그래머스" />
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
