import type { RouteWithHandle } from '@/@types/global';
import { useMemo } from 'react';
import { NavLink } from 'react-router';
import { extractNavItems } from '@/utils/extractNavItems';
import tw from '@/utils/tw';
import { MyPageIcons } from './NavIcons';

interface MyPageNavProps {
  routes: RouteWithHandle[];
  basePath?: string;
  className?: string;
}

function MyPageNav({ routes, basePath = '/my-page', className }: MyPageNavProps) {
  const navList = useMemo(() => extractNavItems(routes, basePath), [routes, basePath]);

  const activeNav = 'bg-rose-200 rounded text-text-primary';
  const defaultNav = 'bg-transparent text-gray-100';

  return (
    <nav
      className={tw(
        'min-w-80 h-full p-4 bg-primary-500 inline-flex flex-col justify-start items-start gap-8',
        className
      )}
    >
      <NavLink
        to="/my-page/settings"
        className="self-stretch flex justify-start items-center gap-4"
      >
        <div className="size-12 bg-zinc-300 rounded-full"></div>
        <span className="justify-start text-secondary-50 text-base font-normal ">userName 님</span>
      </NavLink>
      <ul className="flex flex-col gap-4 w-full">
        {navList.map(({ path, label }) => (
          <li key={path}>
            <NavLink
              to={path}
              end
              className={({ isActive }) =>
                tw(
                  'w-full px-3 py-2 inline-flex justify-start items-center gap-2 text-normal ',
                  isActive ? activeNav : defaultNav
                )
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={isActive ? MyPageIcons[path].active : MyPageIcons[path].default}
                    alt="icon"
                    aria-hidden
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
export default MyPageNav;
