import type { RouteWithHandle } from '@/@types/global';
import { useMemo } from 'react';
import { NavLink } from 'react-router';
import { extractNavItems } from '@/utils/extractNavItems';
import tw from '@/utils/tw';
import { MyPageIcons } from './NavIcons';
import { useAuth } from '@/store/@store';
import { useProfile } from '@/hook/useProfile';

interface MyPageNavProps {
  routes: RouteWithHandle[];
  basePath?: string;
  className?: string;
}

function MyPageNav({ routes, basePath = '/my-page', className }: MyPageNavProps) {
  const navList = useMemo(() => extractNavItems(routes, basePath), [routes, basePath]);

  const activeNav = 'bg-primary-100 text-text-primary';
  const defaultNav = 'bg-transparent text-gray-100 hover:bg-primary-200/40';

  const profileId = useAuth((s) => s.userId);
  const { data: profile, isLoading: profileLoading } = useProfile(profileId ?? undefined);

  const displayName = profileLoading ? '불러오는 중...' : (profile?.nickname ?? '회원');

  const avatarSrc = profile?.profile_image_url || undefined;

  return (
    <nav
      className={tw(
        'min-w-80 h-full p-4 bg-primary-500 inline-flex flex-col justify-start items-start gap-8',
        className
      )}
    >
      <div className="self-stretch flex justify-start items-center gap-4">
        <div className="size-16 border border-zinc-300 rounded-full">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={`${displayName} 님의 프로필 이미지`}
              className="size-full rounded-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="size-full bg-zinc-300"></div>
          )}
        </div>
        <div className="inline-flex flex-col gap-1">
          <span className="justify-start text-secondary-50 text-base font-normal ">
            {displayName} 님
          </span>
          <NavLink to="/my-page/settings" className="text-sm text-secondary-400 underline">
            프로필 수정하기
          </NavLink>
        </div>
      </div>
      <ul className="flex flex-col gap-4 w-full">
        {navList.map(({ path, label }) => (
          <li key={path}>
            <NavLink
              to={path}
              end
              className={({ isActive }) =>
                tw(
                  'w-full px-3 py-2 inline-flex justify-start items-center gap-2 text-normal rounded',
                  'transition-colors duration-200 ease-out',
                  'focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-primary-300',
                  'will-change-[background-color]',
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
