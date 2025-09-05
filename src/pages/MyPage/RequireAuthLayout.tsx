import { useAuth } from '@/store/@store';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useEffect, useRef } from 'react';
import useToast from '@/hook/useToast';
import Spinner from '@/component/Spinner';

function RequireAuthLayout({ children }: { children?: React.ReactNode }) {
  const { userId, isLoading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const announcedRef = useRef(false);

  /* profile guard */
  useEffect(() => {
    if (isLoading || userId) return;

    // error toast 1회만
    if (!announcedRef.current) {
      useToast('error', '로그인이 필요합니다.');
      announcedRef.current = true;
    }

    const t1 = setTimeout(() => {
      useToast('info', '로그인 페이지로 이동합니다.');
    }, 500);
    const t2 = setTimeout(() => {
      navigate('/account/login', { replace: true, state: { from: location } });
    }, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [userId, isLoading, navigate, location]);

  if (isLoading || !userId)
    return (
      <section className="w-full p-8 bg-background-base flex items-center justify-center min-h-[200px]">
        <Spinner />
      </section>
    );

  return <>{children ?? <Outlet />}</>;
}
export default RequireAuthLayout;
