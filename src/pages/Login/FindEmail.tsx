import Button from '@/component/Button';
import Spinner from '@/component/Spinner';
import useToast from '@/hook/useToast';
import { isValidPhone } from '@/utils/isValidPhone';
import { findEmailByPhone } from '@/utils/supabase/findEmailByPhone';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';

function FindEmail() {
  const [phone, setPhone] = useState('');

  const [result, setResult] = useState<React.ReactNode | null>(null);
  const [mode, setMode] = useState<'form' | 'result'>('form');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

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
    setResult(null);

    if (!phone.trim()) {
      useToast('error', '전화번호를 입력해주세요');
      setIsLoading(false);
      return;
    }
    if (!isValidPhone(phone)) {
      useToast('error', '올바른 전화번호를 입력해주세요');
      setIsLoading(false);
      return;
    }

    try {
      const normalized = phone.replace(/\D/g, '');
      const res = await findEmailByPhone(normalized);
      if (res.ok && res.found) {
        setResult(
          <div className="w-full flex flex-col gap-6 justify-center items-center">
            <h2>회원님께서 가입해주신 이메일은 다음과 같습니다.</h2>
            <strong>{res.email_masked}</strong>
            <Button
              type="button"
              color="primary"
              className="mx-auto"
              onClick={() => navigate('/account/login')}
            >
              로그인 하러가기
            </Button>
          </div>
        );
      } else {
        setResult(
          <div className="w-full flex flex-col gap-6 justify-center items-center">
            <p className="text-error-500 text-center">입력하신 번호와 일치하는 계정이 없습니다.</p>
            <Button
              type="button"
              color="primary"
              className="mx-auto"
              onClick={() => setMode('form')}
            >
              번호 재입력하기
            </Button>
          </div>
        );
      }
    } catch (err) {
      setResult(
        <div className="w-full flex flex-col gap-6 justify-center items-center">
          <p className="text-error-500 text-center">에러가 발생했습니다.</p>
          <Button type="button" color="primary" className="mx-auto" onClick={() => setMode('form')}>
            다시 시도하기
          </Button>
        </div>
      );
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
            isLoading ? (
              <Spinner />
            ) : (
              <div className="w-full flex flex-col justify-center items-center gap-6">{result}</div>
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
              <div className="flex flex-col items-center gap-4">
                <Button type="submit" color="primary" disabled={isLoading}>
                  {isLoading ? '확인 중...' : 'Check your Email'}
                </Button>
                <Link to="../login" className="text-center text-primary-500 text-[12px] font-light">
                  로그인 하러가기
                </Link>
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
