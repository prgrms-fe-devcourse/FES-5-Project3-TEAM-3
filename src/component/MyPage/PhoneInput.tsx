import React, { useEffect, useRef, useState } from 'react';
import { formatPhoneNumber } from '@/utils/formatPhoneNumber';
import { isValidPhone } from '@/utils/isValidPhone';

type PhoneInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  value: string;
  onChange: (next: string) => void;
};

function PhoneInput({ value, onChange, disabled, ...rest }: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const prev = useRef<string>(value);

  const [cursor, setCursor] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const before = prev.current;
    const after = formatPhoneNumber(raw);

    // 커서 위치 보정
    const cursorPos = e.target.selectionStart ?? after.length;

    let adjustment = 0;
    if (after.length >= before.length) {
      // 추가 입력 중일 때 마지막이 '-' 이면 커서를 한 칸 뒤로 이동
      if (after[cursorPos - 1] === '-' || after[cursorPos] === '-') adjustment = 1;
    } else if (after.length < before.length) {
      // 삭제 중일 때 지우기 직전 글자가 '-' 이면 커서를 한 칸 앞으로 이동
      if (before[cursorPos - 1] === '-') adjustment = -1;
    }

    setCursor(Math.min(cursorPos + adjustment, after.length));

    prev.current = after;
    onChange(after);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Backspace') return;

    const input = e.currentTarget;
    const cursorPos = input.selectionStart ?? input.value.length;

    // 커서 앞 문자가 '-' 이면 두 글자 지움
    if (cursorPos > 0 && input.value[cursorPos - 1] === '-') {
      e.preventDefault();
      const left = input.value.slice(0, cursorPos - 1).replace(/\D/g, '');
      const right = input.value.slice(cursorPos).replace(/\D/g, '');
      const after = formatPhoneNumber(left + right);
      prev.current = after;
      onChange(after);
      setCursor(Math.max(cursorPos - 1, 0));
    }
  };

  useEffect(() => {
    if (cursor !== null && inputRef.current) {
      requestAnimationFrame(() => {
        inputRef.current?.setSelectionRange(cursor, cursor);
      });
    }
  }, [cursor]);

  return (
    <input
      className="w-full px-6 py-4 bg-secondary-50 border border-gray-500 rounded-2xl outline-0 focus:ring-1 focus:ring-secondary-800"
      type="text"
      inputMode="numeric"
      name="phone"
      placeholder="연락처를 입력해주세요."
      ref={inputRef}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      aria-invalid={!isValidPhone(value)}
      disabled={disabled}
      {...rest}
    />
  );
}
export default PhoneInput;
