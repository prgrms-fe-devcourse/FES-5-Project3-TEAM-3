import Button from '@/component/Button';
import VisibleBtn from '@/component/Login/VisibleBtn';
import supabase from '@/supabase/supabase';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';

function Register() {
  const [nickname, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const pwRef = useRef<HTMLInputElement | null>(null);
  const pwConfirmRef = useRef<HTMLInputElement | null>(null);
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) alert('닉네임을 입력해주세요');
    if (!email.trim()) alert('이메일을 입력해주세요');
    if (!password.trim()) alert('비밀번호를 입력해주세요');
    if (password !== confirmPassword) {
      alert('비밀번호를 다시 확인해주세요');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname },
      },
    });
    if (error) {
      console.error(error);
      alert('회원가입 실패');
      return;
    } else {
      alert('회원가입성공');
      navigate('../login');
    }
  };

  return (
    <div className="flex m-98 mt-10 items-center justify-between">
      <section className="flex flex-col items-center gap-8">
        <div className="flex  flex-col items-center gap-4">
          <h2 className="text-5xl font-extrabold text-primary-500">Create an Account</h2>
          <p className="text-lg text-[#556987] text-center">
            Winepedia에 가입하고 <br />
            와인에 대한 이야기를 나눠보세요
          </p>
        </div>
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <div className="flex items-center gap-4 bg-secondary-50 border-1 border-[#8e95a9] rounded-2xl px-6 py-4">
            <label htmlFor="nickname">
              <img src="/icon/profileIcon.svg" alt="닉네임아이콘" />
            </label>
            <input
              className="outline-none"
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickName(e.target.value)}
              placeholder="닉네임을 입력해주세요"
            />
          </div>
          <div className="flex items-center gap-4 bg-secondary-50 border-1 border-[#8e95a9] rounded-2xl px-6 py-4">
            <label htmlFor="email">
              <img src="/icon/email.svg" alt="이메일아이콘" />
            </label>
            <input
              id="email"
              className="outline-none"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력해주세요"
            />
          </div>
          <div className="flex items-center justify-between bg-secondary-50 border-1 border-[#8e95a9] rounded-2xl px-6 py-4">
            <div className="flex items-center gap-4">
              <label htmlFor="password">
                <img src="/icon/password.svg" alt="비밀번호 아이콘" />
              </label>
              <input
                id="password"
                ref={pwRef}
                className="outline-none"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <VisibleBtn ref={pwRef} />
          </div>
          <div className="flex items-center justify-between   bg-secondary-50 border-1 border-[#8e95a9] rounded-2xl px-6 py-4">
            <div className="flex gap-4 items-center">
              <label htmlFor="passwordConfirm">
                <img src="/icon/password.svg" alt="비밀번호아이콘" />
              </label>
              <input
                id="passwordConfirm"
                ref={pwConfirmRef}
                className="outline-none"
                value={confirmPassword}
                type="password"
                placeholder="비밀번호 확인"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <VisibleBtn ref={pwConfirmRef} />
          </div>
          <div className="flex flex-col gap-4 items-center">
            <Button type="submit" color="primary">
              Create an Account
            </Button>
            <p className="text-sm text-text-secondary font-light">
              이미 winepedia회원이신가요?{' '}
              <Link to="../login" className="text-sm text-primary-500 font-semibold">
                로그인 하러 가기
              </Link>
            </p>
          </div>
        </form>
      </section>
      <section>
        <img src="/image/registerImg.png" alt="회원가입 이미지" />
      </section>
    </div>
  );
}
export default Register;
