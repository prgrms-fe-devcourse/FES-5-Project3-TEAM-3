import Button from '@/component/Button';
import VisibleBtn from '@/component/Login/VisibleBtn';
import useToast from '@/hook/useToast';
import supabase from '@/supabase/supabase';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

function ResetPassword() {
  const navigate = useNavigate();
  const pwRef = useRef(null);
  const pwConfirmRef = useRef(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
 const [busy, setBusy] = useState(false);

   useEffect(() => {
     // 해시가 있으면 제거
     if (window.location.hash) {
       window.history.replaceState(null, '', window.location.pathname + window.location.search);
     }

     // SDK가 자동으로 세운 세션이 실제로 있는지 확인
     (async () => {
       const { data } = await supabase.auth.getSession();
       if (!data.session) {
         useToast('error', '비밀번호 재설정 링크가 만료되었거나 유효하지 않습니다.');
         navigate('/account/findpassword'); // 경로는 프로젝트에 맞게
       }
     })();
   }, [navigate]);

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (busy) return;

     if (password !== confirmPassword) {
       useToast('error', '비밀번호가 일치하지 않습니다.');
       return;
     }

     setBusy(true);
     const { error } = await supabase.auth.updateUser({ password });

     if (error) {
       console.error('비밀번호 변경 실패:', error.message);
       if (error.message.includes('New password should be different')) {
         useToast('error', '기존 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.');
       } else if (error.message.includes('expired')) {
         useToast(
           'error',
           '비밀번호 재설정 링크가 만료되었습니다. 다시 비밀번호 찾기를 진행해주세요.'
         );
       } else {
         useToast('error', '비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
       }
       setBusy(false);
       return;
     }

     // 깔끔하게 로컬 로그아웃 (global 금지)
     await supabase.auth.signOut({ scope: 'local' });

     useToast('success', '비밀번호를 변경하였습니다');
     setPassword('');
     setConfirmPassword('');
     setBusy(false);
     navigate('/');
   };

  return (
    <div className="flex mt-10 my-10 items-center justify-center gap-20">
      <section className="flex flex-col items-center gap-9">
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-5xl text-primary-500 font-extrabold">Change Password</h2>
          <p className="text-lg text-[#556987]">비밀번호를 변경해주세요</p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
          <div className="flex items-center gap-4 bg-secondary-50 border-1 border-[#8e95a9] rounded-2xl px-6 py-4">
            <label htmlFor="password">
              <img src="/icon/password.svg" alt="비밀번호 아이콘" />
            </label>
            <input
              className="outline-none w-full"
              id="password"
              required
              ref={pwRef}
          
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="새 비밀번호를 입력해주세요"
            />
            <VisibleBtn ref={pwRef} />
          </div>
          <div className="flex items-center gap-4 bg-secondary-50 border-1 border-[#8e95a9] rounded-2xl px-6 py-4">
            <label htmlFor="passwordConfirm">
              <img src="/icon/password.svg" alt="비밀번호 아이콘" />
            </label>
            <input
              className="outline-none w-full"
              id="passwordConfirm"
              required
             
              ref={pwConfirmRef}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="새 비밀번호를 확인해주세요"
            />
            <VisibleBtn ref={pwConfirmRef} />
          </div>

    
          <div className="flex flex-col items-center gap-4">
            <Button type="submit" color="primary">
              Chnage Password
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-8 w-145 overflow-hidden">
        <img
          className="w-full h-auto object-cover"
          src="/image/authpassword.png"
          alt="back to your space in moments"
        />
      </section>
    </div>
  );
}
export default ResetPassword;
