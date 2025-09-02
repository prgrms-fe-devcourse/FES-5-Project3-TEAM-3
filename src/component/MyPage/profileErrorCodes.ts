export const ErrorCode = {
  // 권한(Supabase RLS 정책 위반) 에러
  LoginSessionExpired: 'LOGIN_SESSION_EXPIRED',
  PermissionDenied: 'PERMISSION_DENIED',
  // avatar image 에러
  FileUploadFail: 'FILE_UPLOAD_FAIL',
  AvatarUploadFail: 'AVATAR_UPLOAD_FAIL',
  FileTooLarge: 'FILE_TOO_LARGE',
  InvalidFileType: 'INVALID_FILE_TYPE',
  UploadRateLimited: 'UPLOAD_RATE_LIMITED',
  // nickname 에러
  NicknameExists: 'NICKNAME_EXISTS',
  NicknameTooLong: 'NICKNAME_TOO_LONG',
  NicknameRequired: 'NICKNAME_REQUIRED',
  // phoneNumber 에러
  PhoneNumberExists: 'PHONENUMBER_EXISTS',
  InvalidPhoneNumber: 'INVALID_PHONE_NUMBER',
  // bio 에러
  BioTooLong: 'BIO_TOO_LONG',
  // supabase 통신 에러
  SubmitFail: 'SUBMIT_FAIL',
  TooManyRequests: 'TOO_MANY_REQUESTS',
  // 기타 에러
  NetworkError: 'NETWORK_ERROR',
  Unexpected: 'UNEXPECTED',
} as const;

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.LoginSessionExpired]: '로그인 정보가 만료되었습니다. 다시 로그인해주세요.',
  [ErrorCode.PermissionDenied]: '요청을 수행할 권한이 없습니다.',

  [ErrorCode.FileUploadFail]:
    '파일을 업로드하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  [ErrorCode.AvatarUploadFail]: '프로필 이미지를 업로드하지 못했습니다. 잠시 후 다시 시도해주세요.',
  [ErrorCode.FileTooLarge]: '업로드할 수 있는 파일 용량(2MB)을 초과했습니다.',
  [ErrorCode.InvalidFileType]: '이미지 파일만 업로드하실 수 있습니다.',
  [ErrorCode.UploadRateLimited]: '업로드 요청이 너무 잦습니다. 잠시 후 다시 시도해주세요.',

  [ErrorCode.NicknameExists]: '이미 사용 중인 닉네임입니다.',
  [ErrorCode.NicknameTooLong]: '닉네임은 최대 20자까지 입력할 수 있습니다.',
  [ErrorCode.NicknameRequired]: '닉네임은 필수값입니다.',

  [ErrorCode.PhoneNumberExists]:
    '입력하신 정보를 처리하는 데 실패했습니다. 전화번호를 확인하신 후 다시 시도해주세요.',
  [ErrorCode.InvalidPhoneNumber]: '올바른 전화번호 형식이 아닙니다.',

  [ErrorCode.BioTooLong]: '자기소개는 최대 300자까지 입력할 수 있습니다.',

  [ErrorCode.SubmitFail]: '프로필 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
  [ErrorCode.TooManyRequests]: '요청이 너무 잦습니다. 잠시 후 다시 시도해주세요.',

  [ErrorCode.NetworkError]:
    '네트워크 연결에 문제가 있습니다. 연결을 확인하신 뒤 다시 시도해주세요.',
  [ErrorCode.Unexpected]: '예기치 못한 에러가 발생했습니다. 잠시 후 다시 시도해주세요.',
};

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
