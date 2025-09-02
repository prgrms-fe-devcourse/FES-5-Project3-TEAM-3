import Button from "@/component/Button";
import VisibleBtn from "@/component/Login/VisibleBtn";
import useToast from "@/hook/useToast";
import supabase from "@/supabase/supabase";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

function ResetPassword() {

    const [resetPassword,setResetPassword] = useState(false)
    const navigate = useNavigate();
    const pwRef = useRef(null);
    const pwConfirmRef = useRef(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

  
  
  useEffect(() => {
    const { data:{subscription} } = supabase.auth.onAuthStateChange(
      async (event, session) => { 
      if (event === 'PASSWORD_RECOVERY') setResetPassword(true)
      if(event === 'SIGNED_IN' && session?.user) setResetPassword(true)
    })
    
    supabase.auth.getSession().then(({ data }) => {
      if(data.session) setResetPassword(true)
    })
    
    return () => subscription.unsubscribe()
  },[])



  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      useToast('error', '비밀번호를 다시 확인해주세요.');
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      useToast('error','비밀번호를 다시 확인해주세요')
      console.error(error)
      return
    }
    useToast('success', '비밀번호가 변경되었습니다.')
    navigate('../login')
  };

  return (
    <div className="flex mx-98 mt-10  items-center justify-between">
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
              disabled={!resetPassword}
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
              disabled={!resetPassword}
              ref={pwConfirmRef}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="새 비밀번호를 확인해주세요"
            />
            <VisibleBtn ref={pwRef} />
          </div>

          {!resetPassword && (
            <p className="text-center text-error-600">정상적인 접근이 아닙니다.</p>
          )}
          <div className="flex flex-col items-center gap-4">
            <Button type="submit" color="primary" disabled={!resetPassword}>
              Chnage Password
            </Button>
          </div>
        </form>
      </section>

      <section>
        <img src="/image/authpassword.png" alt="back to your space in moments" />
      </section>
    </div>
  );
}
export default ResetPassword