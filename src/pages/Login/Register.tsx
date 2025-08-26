import Button from '@/component/Button';
import { Link } from 'react-router';

function Register() {
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
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1.5 bg-secondary-50 border-1 border-[#8e95a9] rounded-2xl px-6 py-4">
            <label>
              <img src="/icon/profileIcon.svg" alt="닉네임아이콘" />
            </label>
            <input className="outline-none" type="text" placeholder="닉네임을 입력해주세요" />
          </div>
          <div className="flex items-center gap-1.5 bg-secondary-50 border-1 border-[#8e95a9] rounded-2xl px-6 py-4">
            <label>
              <img src="/icon/email.svg" alt="이메일아이콘" />
            </label>
            <input className="outline-none" type="email" placeholder="이메일을 입력해주세요" />
          </div>
          <div className="flex items-center gap-1.5 bg-secondary-50 border-1 border-[#8e95a9] rounded-2xl px-6 py-4">
            <label>
              <img src="/icon/password.svg" alt="비밀번호 아이콘" />
            </label>
            <input className="outline-none" type="password" placeholder="비밀번호를 입력하세요" />
            <button type="button">
              <img src="/icon/visible.svg" alt="비밀번호 공개" />
            </button>
          </div>
          <div className="flex items-center gap-1.5  bg-secondary-50 border-1 border-[#8e95a9] rounded-2xl px-6 py-4">
            <label>
              <img src="/icon/password.svg" alt="비밀번호아이콘" />
            </label>
            <input className="outline-none" type="password" placeholder="비밀번호 확인" />
            <button type="button">
              <img src="/icon/visible.svg" alt="비밀번호 공개" />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <Button color="primary">Create an Account</Button>
          <p className="text-sm text-text-secondary font-light">
            이미 winepedia회원이신가요?{' '}
            <Link to="../login" className="text-sm text-primary-500 font-semibold">
              로그인 하러 가기
            </Link>
          </p>
        </div>
      </section>
      <section>
        <img src="/image/registerImg.png" alt="회원가입 이미지" />
      </section>
    </div>
  );
}
export default Register;
