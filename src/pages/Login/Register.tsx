import Button from '@/component/Button';
import VisibleBtn from '@/component/Login/VisibleBtn';
import { useProfile } from '@/hook/fetch';
import useToast from '@/hook/useToast';
import type { Tables } from '@/supabase/database.types';
import supabase from '@/supabase/supabase';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';

type Profile = Pick<Tables<'profile'>,'nickname'> 


function Register() {
  
  const [users, setUsers] = useState<Profile[]>([])
  const [nickname, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const userNickname = users.some((a) => a.nickname.includes(nickname));


  const navigate = useNavigate();
  const pwRef = useRef<HTMLInputElement | null>(null);
  const pwConfirmRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    (async () => {
      const profile = await useProfile()
      setUsers(profile ?? [])
    })()
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      useToast('error', '닉네임을 입력해주세요');
      return;
    }
    if (!email.trim()) {
      useToast('error', '이메일을 입력해주세요');
      return;
    }
    if (!password.trim()) {
      useToast('error', '비밀번호를 입력해주세요');
      return;
    }
    if (!phone.trim()) {
      useToast('error', '휴대폰 번호를 입력해주세요');
      return;
    }
    if (phone.length < 11) {
      useToast('error', '휴대폰번호를 확인해주세요');
      return;
    }
  if (!(phone.startsWith('010') || phone.startsWith('02'))) {
    useToast('error', '휴대전화 형식이 다릅니다');
    return;
  }
    
    if (password !== confirmPassword) {
      useToast('error', '비밀번호를 다시 확인해주세요');
      return;
    }
    if (userNickname) {
      useToast('error','이미 사용 중인 닉네임입니다.')
      return
    }

    const { data:signdata,error } = await supabase.auth.signUp({
      email:email.trim(),
      password,
      options: {
        data: { nickname:nickname.trim(), phone:phone.trim() },
      },
    });
  
    const userId = signdata.user?.id;

    if (error) {
      console.error(error);
      useToast('error', '회원가입에 실패하셨습니다');
      return;
    } else {
        if (error) {
          useToast('error', '로그인 정보를 다시 확인해주세요');
        } else {
      
              await supabase.from('profile').insert({
                profile_id: userId,
                nickname: nickname.trim(),
                email: email.trim(),
                phone: phone.trim(),
              })
          useToast('success', '회원가입에 성공하셨습니다'); 
          navigate('/');
        }
    }
  };

const validatePhone = (v: string) => {
  const digits = v.replace(/\D/g, '');

  // 02: 02 + 3 + 4 = 총 9자리
  const isSeoul = /^02\d{7}$/.test(digits);

  // 그 외: 0으로 시작, 02는 제외, 총 10~11자리
  const isOther = /^0(?!2)\d{9,10}$/.test(digits);

  return isSeoul || isOther;
};

  const formatPhone = (digits: string) => {
    if (digits.startsWith('02')) {
      return digits
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{3})(\d{0,4}).*/, (_, a, b, c) =>
          c ? `${a}-${b}-${c}` : b ? `${a}-${b}` : `${a}`
        );
    }
    return digits
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d{3,4})(\d{0,4}).*/, (_, a, b, c) =>
        c ? `${a}-${b}-${c}` : b ? `${a}-${b}` : `${a}`
      );
  };

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

  const digits = e.target.value.replace(/\D/g, '');

  setPhone(formatPhone(digits));

  };
  
  const handleBlur = () => {
    const digits = phone.replace(/\D/g, '');
    if (!validatePhone(digits)) {
      throw new Error('전화번호 형식을 확인해주세요.');
    } 
  };



  return (
    <div className="flex mt-10 my-10 items-center justify-center gap-20">
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
              className="outline-none w-full"
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
              className="outline-none w-full"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력해주세요"
            />
          </div>
          <div className="flex items-center gap-4 bg-secondary-50 border-1 border-[#8e95a9] rounded-2xl px-6 py-4">
            <label htmlFor="phone">
              <img src="/icon/phone.svg" alt="휴대폰 아이콘" />
            </label>
            <input
              className="outline-none w-full"
              id="phone"
              type="tel"
              required
              value={phone}
              onBlur={handleBlur}
              onChange={(e) => handleChange(e)}
              placeholder=' "ㅡ" 없이 휴대폰번호를 입력해주세요'
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
                className="outline-none w-full"
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
                className="outline-none w-full"
                value={confirmPassword}
                type="password"
                placeholder="비밀번호를 확인해 주세요"
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
      <section className="rounded-8 w-145  overflow-hidden">
        <img
          className="w-full h-auto object-cover"
          src="/image/registerImg.png"
          alt="회원가입 이미지"
        />
      </section>
    </div>
  );
}
export default Register;
