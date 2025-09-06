import Button from '@/component/Button';
import VisibleBtn from '@/component/Login/VisibleBtn';
import useToast from '@/hook/useToast';
import { useAuth } from '@/store/@store';
import supabase from '@/supabase/supabase';
import { useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useShallow } from 'zustand/shallow';

function Login() {
  const { userId, signOut } = useAuth(
    useShallow((s) => ({
      userId: s.userId,
      signOut: s.signOut,
    }))
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const pwRef = useRef<HTMLInputElement | null>(null);
  const { state } = useLocation();

  useLayoutEffect(() => {
    if (userId) {
      (async () => await signOut())();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      useToast('error', '로그인 정보를 다시 확인해주세요');
      return
    }   const raw = typeof state === 'string' ? state : '/';

    let pathname = '/';
    try {
      const url = new URL(raw, window.location.origin);
      pathname = url.pathname; 
    } catch {
      pathname = raw.startsWith('/') ? raw : '/';
    }

    const authPaths = [
      '/account/login',
      '/account/register',
      '/account/findpassword',
      '/account/findemail',
      '/account/resetpassword',
    ];

      const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

      if (isAuthPage) {
        navigate('/');
      } else {
        navigate(pathname.startsWith('/') ? raw : '/');
      }
  };

  return (
    <>
      <div className="flex mt-10 my-10 justify-center items-center gap-20">
        <section className="flex flex-col items-center gap-9">
          <div className="flex flex-col gap-4 items-center">
            <h2 className="text-5xl text-primary-500 font-extrabold">Login</h2>
            <p className="text-lg text-[#556987]">winepedia 계정으로 로그인</p>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <div className="flex items-center gap-4 bg-secondary-50 border-1 border-[#8e95a9] rounded-2xl px-6 py-4">
              <label htmlFor="email">
                <img src="/icon/email.svg" alt="이메일 아이콘" />
              </label>
              <input
                className="outline-none w-full"
                value={email}
                id="email"
                autoComplete="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="이메일을 입력해 주세요"
              />
            </div>
            <div className="flex items-center justify-between bg-secondary-50 border-1 border-[#8e95a9] rounded-2xl px-6 py-4">
              <div className="flex gap-4 items-center">
                <label htmlFor="password">
                  <img src="/icon/password.svg" alt="패스워드 아이콘" />
                </label>
                <input
                  className="outline-none w-full"
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  ref={pwRef}
                  required
                  type="password"
                  placeholder="비밀번호를 입력해 주세요"
                />
              </div>
              <VisibleBtn ref={pwRef} />
            </div>
            <div className="flex flex-col items-center gap-4">
              <Button type="submit" color="primary">
                Sign In
              </Button>
              <p className="text-sm text-text-secondary">
                아직 계정이 없으신가요?{' '}
                <Link to="../register" className="text-primary-500 text-sm font-bold">
                  회원가입 하러가기
                </Link>
              </p>
              <div className="flex gap-8">
                <Link
                  to="../findemail"
                  className="text-right text-primary-500 text-[12px] font-light"
                >
                  이메일찾기
                </Link>{' '}
                <Link
                  to="../findpassword"
                  className="text-right text-primary-500 text-[12px] font-light"
                >
                  비밀번호찾기
                </Link>
              </div>
            </div>
          </form>
        </section>

        <section className="rounded-8 w-145 overflow-hidden">
          <img className="w-full h-auto object-cover" src="/image/loginImg.png" alt="로그인 화면" />
        </section>
      </div>
    </>
  );
}
export default Login;
