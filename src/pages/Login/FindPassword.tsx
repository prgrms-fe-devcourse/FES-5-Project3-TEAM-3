import Button from "@/component/Button";
import { useAuth } from "@/store/@store";
import { useState } from "react";
import { Link } from "react-router";

function FindPassword() {

  const resetPassword = useAuth((s) => s.resetPassword)
  const [email,setEmail] = useState('')
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetPassword(email);
  };

  return (
    <>
      <div className="flex mx-98 mt-10  items-center justify-between">
        <section className="flex flex-col items-center gap-9">
          <div className="flex flex-col gap-4 items-center">
            <h2 className="text-5xl text-primary-500 font-extrabold">Change Password</h2>
            <p className="text-lg text-[#556987]">인증을 위해 이메일주소를 입력해주세요</p>
          </div>
          <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
            <div className="flex items-center gap-4 bg-secondary-50 border-1 border-[#8e95a9] rounded-2xl px-6 py-4">
              <label htmlFor="email">
                <img src="/icon/email.svg" alt="이메일 아이콘" />
              </label>
              <input
                className="outline-none w-full"
                id="email"
                autoComplete="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="이메일을 입력해 주세요"
              />
            </div>
            <Link to="../login" className="text-right text-primary-500 text-[12px] font-light">
              로그인 하러가기
            </Link>
            <div className="flex flex-col items-center gap-4">
              <Button type="submit" color="primary">
                Send Email
              </Button>
            </div>
          </form>
        </section>

        <section>
          <img src="/image/FoundPassword.png" alt="we'll help you get back in" />
        </section>
      </div>
    </>
  );
}
export default FindPassword