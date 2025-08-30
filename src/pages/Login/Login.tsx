import Button from '@/component/Button';
import VisibleBtn from '@/component/Login/VisibleBtn';
import supabase from '@/supabase/supabase';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const pwRef = useRef<HTMLInputElement | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const userNickName = data.user?.user_metadata.nickname;
    const userId = data.user?.id;
    const userEmail = data.user?.email ?? email;

    if (error) {
      console.error(error);
    } else {
      await supabase.from('profile').insert({
        profile_id: userId,
        nickname: userNickName,
        email: userEmail,
      });

      navigate('/');
    }
  };

  return (
    <>
      <div className="flex mx-98 mt-10  items-center justify-between">
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
                className="outline-none"
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
                  className="outline-none"
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
            <Link to='../findpassword' className="text-right text-primary-500 text-[12px] font-light">
              비밀번호를 잊어버리셨나요?
            </Link>
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
            </div>
          </form>
        </section>

        <section>
          <img src="/image/loginImg.png" alt="로그인 화면" />
        </section>
      </div>
    </>
  );
}
export default Login;
