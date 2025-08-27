/**
 * 전화번호 Input을 받아서 자동으로 하이픈을 넣어주는 함수입니다.
 * @param input: 사용자의 전화번호 입력값 (01012341234)
 * @return formatting 된 전화번호 값 (010-1234-1234)
 */

export const formatPhoneNumber = (input: string) => {
  if (input === '') return '';

  const inputNumber = input.replace(/\D/g, '');

  // 02(서울) 처리
  if (inputNumber.startsWith('02')) {
    if (inputNumber.length <= 2) return inputNumber;
    if (inputNumber.length <= 5) return `${inputNumber.slice(0, 2)}-${inputNumber.slice(2)}`;
    if (inputNumber.length <= 9)
      return `${inputNumber.slice(0, 2)}-${inputNumber.slice(2, inputNumber.length - 4)}-${inputNumber.slice(-4)}`;
  }

  if (inputNumber.length <= 3) return inputNumber;
  if (inputNumber.length <= 7) return `${inputNumber.slice(0, 3)}-${inputNumber.slice(3)}`;
  if (inputNumber.length <= 12)
    return `${inputNumber.slice(0, 3)}-${inputNumber.slice(3, inputNumber.length - 4)}-${inputNumber.slice(-4)}`;

  return inputNumber;
};
