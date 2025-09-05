import { useAuth } from '@/store/@store';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { useShallow } from 'zustand/shallow';
import HeaderSearchSection from './search/HeaderSearchSection';
import clsx from 'clsx';
import supabase from '@/supabase/supabase';
import ScrollToTop from '@/hook/ScrolToTop';

function Header() {
  const { userId, signOut } = useAuth(
    useShallow((s) => ({
      userId: s.userId,
      signOut: s.signOut,
    }))
  );

  const { pathname, search } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchBar, setSearchBar] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [userImage, setUserImage] = useState('');
  useLayoutEffect(() => {
    setSearchBar(false);
  }, [pathname, search]);
  // 쿼리스트링의 keywordk변경마다 search바 닫힘

  useEffect(() => {
    if (pathname !== '/') return;
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('profile')
        .select('profile_image_url')
        .eq('profile_id', userId)
        .single();

      if (error) console.log(error);
      if (data) setUserImage(data.profile_image_url);
    };
    fetchData();
  }, [userId]);

  const handleSearch = () => {
    setSearchBar(!searchBar);
    setOverlay(true);

    if (window.scrollY <= 1) {
      setScrolled(!scrolled);
    }
  };

  const base = ' h-13 w-screen flex items-center justify-center fixed z-99 duration-400 lg:h-17.5';

  const headerBgClass = clsx(
    base,
    pathname == '/' ? (scrolled ? 'bg-primary-500' : 'bg-tranprent') : 'bg-primary-500'
  );

  return (
    <div className={pathname == '/' ? '' : 'h-17.5'}>
      {overlay && (
        <div className="fixed inset-0 bg-black/40 z-90" onClick={() => setSearchBar(false)}></div>
      )}

      <div className={headerBgClass}>
        <div className="w-full max-w-[90rem] flex justify-between items-center px-4 md:px-10 py-2">
          <h1 className="w-32 h-9 md:w-41.5 md:h-11.75 flex items-center pt-1">
            <NavLink to="/" onClick={ScrollToTop}>
              <img src="/image/Logo.png" alt="winepedia" />
            </NavLink>
          </h1>
          <nav className="flex items-center gap-3 sm:gap-4">
            <button className="cursor-pointer" type="button" onClick={handleSearch}>
              <svg
                width="22"
                height="22"
                className="md:w-[25px] md:h-[25px]"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24.6296 22.4305L18.6606 16.4615C20.2873 14.4721 21.087 11.9336 20.8945 9.37104C20.7019 6.80851 19.5318 4.41801 17.6262 2.694C15.7206 0.969988 13.2252 0.0443695 10.6563 0.108601C8.08732 0.172833 5.64134 1.222 3.82425 3.03909C2.00716 4.85618 0.957989 7.30217 0.893758 9.87112C0.829526 12.4401 1.75514 14.9354 3.47915 16.8411C5.20316 18.7467 7.59366 19.9168 10.1562 20.1093C12.7187 20.3019 15.2572 19.5021 17.2466 17.8755L23.2156 23.8445C23.4042 24.0266 23.6568 24.1274 23.919 24.1252C24.1812 24.1229 24.432 24.0177 24.6175 23.8323C24.8029 23.6469 24.908 23.3961 24.9103 23.1339C24.9126 22.8717 24.8118 22.6191 24.6296 22.4305ZM10.9226 18.1375C9.34038 18.1375 7.79366 17.6683 6.47807 16.7892C5.16248 15.9102 4.1371 14.6608 3.5316 13.1989C2.9261 11.7371 2.76767 10.1286 3.07635 8.57675C3.38503 7.02491 4.14696 5.59944 5.26578 4.48062C6.3846 3.3618 7.81006 2.59988 9.36191 2.29119C10.9138 1.98251 12.5223 2.14094 13.9841 2.74644C15.4459 3.35194 16.6953 4.37732 17.5744 5.69291C18.4534 7.00851 18.9226 8.55523 18.9226 10.1375C18.9203 12.2585 18.0766 14.2919 16.5769 15.7917C15.0771 17.2915 13.0436 18.1351 10.9226 18.1375Z"
                  fill="#FCF8F3"
                />
              </svg>
            </button>
            <NavLink to="wines" className="font-semibold text-secondary-50 text-sm md:text-base">
              Wine
            </NavLink>
            <NavLink to="community" className="font-semibold text-secondary-50 text-sm md:text-base">
              Community
            </NavLink>

            {userId ? (
              <div className="flex gap-3 md:gap-4 items-center">
                <button
                  type="button"
                  onClick={signOut}
                  className="cursor-pointer text-secondary-50 font-semibold text-sm md:text-base"
                >
                  Logout
                </button>
                <Link to="my-page">
                  <img
                    src={userImage ? userImage : '/image/defaultProfile.png'}
                    alt="프로필이미지"
                    className="rounded-full w-8 h-8 md:w-10 md:h-10 cursor-pointer"
                  />
                </Link>
              </div>
            ) : (
              <NavLink
                to="account/login"
                className="flex font-semibold text-secondary-50 items-center gap-2 text-sm md:text-base"
              >
                <img src="/icon/fi-rr-glass-cheers.svg" alt="로그인아이콘" />
                Login
              </NavLink>
            )}
          </nav>
          <HeaderSearchSection searchBar={searchBar} setOverlay={setOverlay} />
        </div>
      </div>
    </div>
  );
}

export default Header;
