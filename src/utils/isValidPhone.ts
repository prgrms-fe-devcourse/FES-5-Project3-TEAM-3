/**
 * 전화번호 Input이 한국 전화번호 형식에 일치하는지 검증하는 함수입니다.
 * @param input: 사용자의 전화번호 입력값 (01012341234, 02-123-1234 등)
 * @return boolean (true = 테스트 통과 / false = 테스트 실패)
 */

export const isValidPhone = (input: string): boolean => {
  const phoneNumber = input.replace(/\D/g, '');
  if (!phoneNumber) return false;

  // 서울 02
  if (phoneNumber.startsWith('02')) {
    if (phoneNumber.length < 9 || phoneNumber.length > 10) return false;
    return true;
  }

  // 그 외 지역번호 또는 핸드폰번호 (0xx)
  const phoneRegex = /^0\d{9,10}$/;

  if (!phoneRegex.test(phoneNumber)) return false;

  return true;
};
