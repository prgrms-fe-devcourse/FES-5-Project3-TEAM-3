import Button from "@/component/Button"
import { Link } from "react-router"

function Login() {
  return (
    <>
      <div className="flex mx-98 mt-10  items-center justify-between">
        <section className="flex flex-col items-center gap-9">
          <div className="flex flex-col gap-4 items-center">
            <h2 className="text-5xl text-primary-500 font-extrabold">Login</h2>
            <p className="text-lg text-[#556987]">winepedia 계정으로 로그인</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-1.5 bg-secondary-50 border-1 border-[#8e95a9] rounded-2xl px-6 py-4">
              <label>
                <img src="/icon/email.svg" alt="이메일 아이콘" />
              </label>
              <input className="outline-none" type="email" placeholder="이메일을 입력해 주세요" />
            </div>
            <div className="flex items-center gap-1.5 bg-secondary-50 border-1 border-[#8e95a9] rounded-2xl px-6 py-4">
              <label>
                <img src="/icon/password.svg" alt="패스워드 아이콘" />
              </label>
              <input
                className="outline-none"
                type="password"
                placeholder="비밀번호를 입력해 주세요"
              />
              <button type="button">
                <img src="/icon/visible.svg" alt="비밀번호 공개" />
              </button>
            </div>
            <a className="text-right text-primary-500 text-[12px] font-light">
              비밀번호를 잊어버리셨나요?
            </a>
          </div>
          <div className="flex flex-col items-center">
            <Button color="primary">Sign In</Button>
            <p className="text-sm text-text-secondary">
              아직 계정이 없으신가요?{' '}
              <Link to="../register" className="text-primary-500 text-sm font-bold">
                회원가입 하러가기
              </Link>
            </p>
          </div>
        </section>

        <section>
          <img src="/image/loginImg.png" alt="로그인 화면" />
        </section>
      </div>
    </>
  );
}
export default Login