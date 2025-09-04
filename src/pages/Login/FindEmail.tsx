import Button from '@/component/Button';
import Spinner from '@/component/Spinner';
import useToast from '@/hook/useToast';
import supabase from '@/supabase/supabase';
import { useState } from 'react';
import { Link } from 'react-router';

function FindEmail() {
  const [phone, setPhone] = useState('');

  const [foundEmail, setFoundEmail] = useState<string | null>(null);
  const [mode, setMode] = useState<'form' | 'result'>('form');
  const [isloading, setIsloading] = useState(false);

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
  setIsloading(true);

  try {
    const digits = phone.replace(/\D/g, ''); // 숫자만
    if (!digits) {
      useToast('error', '휴대폰 번호를 입력해주세요'); // 또는 toast('error', ...)
      return;
    }
    if (!digits.startsWith('010') || digits.length !== 11) {
      useToast('error', '휴대전화 형식이 다릅니다');
      return;
    }

    // 'https://tejflzndemytckczpazg.supabase.co/functions/v1/findId' 배포용 fetch링크
    const response = await supabase.functions.invoke('https://tejflzndemytckczpazg.supabase.co/functions/v1/findId', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { phone: digits }, // ← 하이픈 제거하고 전송
    });

    const result = response.data as { found: boolean; emailMasked?: string };
    if (!result.found || !result.emailMasked) {
      useToast('error', '일치하는 계정을 찾지 못했습니다');
      return;
    }
    setFoundEmail(result.emailMasked); // ← 서버 키와 맞춤
    setMode('result');

  } catch (err) {
    useToast('error', '서버 요청 중 오류가 발생했습니다.');
  } finally {
    setIsloading(false);
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
                <h2>회원님께서 가입해주신 이메일은 다음과 같습니다.</h2>
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
