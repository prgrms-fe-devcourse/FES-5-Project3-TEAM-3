import Button from "@/component/Button";
import VisibleBtn from "@/component/Login/VisibleBtn";
import { useRef } from "react";
import { Link } from "react-router";

function FindPassword() {

  const pwRef = useRef(null)
  const pwConfirmRef =useRef(null)
  return (
    <>
      <div className="flex mx-98 mt-10  items-center justify-between">
        <section className="flex flex-col items-center gap-9">
          <div className="flex flex-col gap-4 items-center">
            <h2 className="text-5xl text-primary-500 font-extrabold">Change Password</h2>
            <p className="text-lg text-[#556987]">비밀번호를 변경해주세요</p>
          </div>
          <form className="flex flex-col gap-4">
            <div className="flex items-center gap-4 bg-secondary-50 border-1 border-[#8e95a9] rounded-2xl px-6 py-4">
              <label htmlFor="email">
                <img src="/icon/email.svg" alt="이메일 아이콘" />
              </label>
              <input
                className="outline-none"
                id="email"
                autoComplete="email"
                required
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
                  id="password"
                  ref={pwRef}
                  required
                  type="password"
                  placeholder="비밀번호를 입력해 주세요"
                />
              </div>
              <VisibleBtn ref={pwRef} />
            </div>
            <div className="flex items-center justify-between bg-secondary-50 border-1 border-[#8e95a9] rounded-2xl px-6 py-4">
              <div className="flex gap-4 items-center">
                <label htmlFor="password">
                  <img src="/icon/password.svg" alt="패스워드 아이콘" />
                </label>
                <input
                  className="outline-none"
                  id="password"
                  ref={pwConfirmRef}
                  required
                  type="password"
                  placeholder="비밀번호를 확인해 주세요"
                />
              </div>
              <VisibleBtn ref={pwConfirmRef} />
            </div>
            <Link to="../login" className="text-right text-primary-500 text-[12px] font-light">
              로그인 하러가기
            </Link>
            <div className="flex flex-col items-center gap-4">
              <Button type="submit" color="primary">
                Change Password
              </Button>
            </div>
          </form>
        </section>

        <section>
          <img src="/image/404image.png" alt="로그인 화면" />
        </section>
      </div>
    </>
  );
}
export default FindPassword