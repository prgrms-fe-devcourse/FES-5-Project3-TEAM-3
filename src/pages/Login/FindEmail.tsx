import Button from '@/component/Button';
import Spinner from '@/component/Spinner';
import useToast from '@/hook/useToast';
import { isValidPhone } from '@/utils/isValidPhone';
import { findEmailByPhone } from '@/utils/supabase/findEmailByPhone';
import { useState } from 'react';
import { Link } from 'react-router';

function FindEmail() {
  const [phone, setPhone] = useState('');

  const [foundEmail, setFoundEmail] = useState<string | null>(null);
  const [mode, setMode] = useState<'form' | 'result'>('form');
  const [isloading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target.value;
    let raw = target.replace(/\D/g, '');

    if (raw.length <= 11) {
      raw = raw.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      setPhone(raw);
    } else if (raw.length > 11) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFoundEmail(null);

    if (!phone.trim()) {
      useToast('error', '전화번호를 입력해주세요');
      return;
    }
    if (!isValidPhone(phone)) {
      useToast('error', '올바른 전화번호를 입력해주세요');
      return;
    }

    try {
      const normalized = phone.replace(/\D/g, '');
      const res = await findEmailByPhone(normalized);
      if (res.ok && res.found) {
        setFoundEmail(`회원님께서 가입해주신 이메일은 다음과 같습니다: ${res.email_masked}`);
      } else {
        setFoundEmail('입력하신 번호와 일치하는 계정이 없습니다.');
      }
    } catch (err) {
      setFoundEmail('에러가 발생했습니다.');
      useToast('error', '서버 요청 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setMode('result');
    }
  };

  return (
    <>
      <div className="flex mt-10 my-10 items-center justify-center gap-20">
        <section className="flex flex-col items-center gap-9">
          <div className="flex flex-col gap-4 items-center">
            <h2 className="text-5xl text-primary-500 font-extrabold">Forgot your Email?</h2>
            <p className="text-lg text-[#556987]">인증을 위해 휴대폰번호를 입력해주세요</p>
          </div>
          {mode == 'result' ? (
            isloading ? (
              <Spinner />
            ) : (
              <>
                <p>{foundEmail}</p>
              </>
            )
          ) : (
            <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
              <div className="flex items-center gap-4 bg-secondary-50 border-1 border-[#8e95a9] rounded-2xl px-6 py-4">
                <label htmlFor="phone">
                  <img src="/icon/phone.svg" alt="휴대폰 아이콘" />
                </label>
                <input
                  className="outline-none w-full"
                  id="phone"
                  value={phone}
                  onChange={(e) => handleChange(e)}
                  required
                  type="tel"
                  placeholder="휴대폰번호를 입력해 주세요"
                />
              </div>
              <Link to="../login" className="text-right text-primary-500 text-[12px] font-light">
                로그인 하러가기
              </Link>
              <div className="flex flex-col items-center gap-4">
                <Button type="submit" color="primary">
                  Check your Email
                </Button>
              </div>
            </form>
          )}
        </section>

        <section className="rounded-8 w-145 overflow-hidden">
          <img
            className="w-full h-auto object-cover"
            src="/image/foundIemail.png"
            alt="로그인 화면"
          />
        </section>
      </div>
    </>
  );
}
export default FindEmail;
