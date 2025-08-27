import { useEffect, useState } from 'react';
import Button from '../Button';
import PhoneInput from './phoneInput';
import { formatPhoneNumber } from '@/utils/formatPhoneNumber';
import { useProfileSettingError } from '@/hook/useProfileSettingError';
import { ErrorCode } from './profileErrorCodes';
import { isValidPhone } from '@/utils/isValidPhone';

interface InfoProps {
  email?: string | null;
  initialNickname?: string | null;
  initialPhone?: string | null;
  maxNicknameLength?: number;
}

function SettingPersonalInfo({
  email = 'user.Email',
  initialNickname = '',
  initialPhone = '',
  maxNicknameLength = 20,
}: InfoProps) {
  const fieldNick = 'nickname' as const;
  const fieldPhone = 'phone' as const;

  const { busy, setBusy, setError, clearError, getMessage } = useProfileSettingError();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>(initialNickname ?? '');
  const [phone, setPhone] = useState<string>(formatPhoneNumber(initialPhone ?? ''));

  useEffect(() => {
    if (!isEditing) {
      setNickname(initialNickname ?? '');
      setPhone(formatPhoneNumber(initialPhone ?? ''));
    }
  }, [initialNickname, initialPhone, isEditing]);

  const hasChanged =
    (initialNickname ?? '') !== nickname || formatPhoneNumber(initialPhone ?? '') !== phone;

  const onChangeNickname = (value: string) => {
    setNickname(value);
    if (value.length > maxNicknameLength) setError(fieldNick, ErrorCode.NicknameTooLong);
    else if (getMessage(fieldNick)) clearError(fieldNick);
  };

  const onChangePhone = (next: string) => {
    setPhone(next);
    if (!isValidPhone(next)) setError(fieldPhone, ErrorCode.InvalidPhoneNumber);
    else if (getMessage(fieldPhone)) clearError(fieldPhone);
  };

  const startEditInfo = () => {
    setIsEditing(true);
    clearError(fieldNick);
    clearError(fieldPhone);
  };

  const saveInfo = () => {
    // 변경 없이 save 하면 종료하고 return
    if (!hasChanged) {
      setIsEditing(false);
      return;
    }

    // Client validation
    clearError(fieldNick);
    clearError(fieldPhone);

    let invalid = false;
    if (nickname.length > maxNicknameLength) {
      setError(fieldNick, ErrorCode.NicknameTooLong);
      invalid = true;
    }
    if (!isValidPhone(phone)) {
      setError(fieldPhone, ErrorCode.InvalidPhoneNumber);
      invalid = true;
    }
    if (invalid) return;

    setBusy('info', true);
    try {
      // upsert fetch
      console.log('saved!');
      setIsEditing(false);
    } catch (err) {
      console.error('failed:', err);
    } finally {
      setBusy('info', false);
    }
  };

  const cancelEditInfo = () => {
    if (hasChanged) {
      const ok = confirm('수정된 내용이 저장되지 않습니다. 정말 취소하시겠습니까?');
      if (!ok) return;
    }

    setNickname(initialNickname ?? 'username');
    setPhone(formatPhoneNumber(initialPhone ?? ''));
    clearError(fieldNick);
    clearError(fieldPhone);
    setIsEditing(false);
  };

  return (
    <section className="w-full p-8 rounded-lg bg-secondary-100 border border-gray-300 flex flex-col gap-6">
      <div className="flex justify-between">
        <h3 className="font-bold text-2xl">Personal Info</h3>
        <div className="buttonGroup flex items-center justify-end gap-2">
          {isEditing ? (
            <>
              <Button
                type="button"
                size="sm"
                color="primary"
                borderType="solid"
                hasIcon
                onClick={saveInfo}
                disabled={
                  busy.info || !!getMessage(fieldNick) || !!getMessage(fieldPhone) || !hasChanged
                }
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                color="primary"
                borderType="outline"
                hasIcon
                onClick={cancelEditInfo}
                disabled={busy.info}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              type="button"
              size="sm"
              color="primary"
              borderType="outline"
              hasIcon
              onClick={startEditInfo}
            >
              <img src="/icon/edit.svg" alt="수정 아이콘" />
              <span>Edit</span>
            </Button>
          )}
        </div>
      </div>

      <hr />

      <div className="flex w-full justify-between items-start gap-6">
        {/* Email Section - 수정 불가 */}
        <div className="w-1/3 flex flex-col gap-2">
          <span className="text-gray-500 w-full font-light">Email</span>
          <span className="text-text-primary font-bold text-xl break-all">{email}</span>
        </div>

        {/* Nickname Section */}
        <div className="w-1/3 flex flex-col gap-2">
          <span className="text-gray-500 w-full font-light">Nickname</span>
          {isEditing ? (
            <label
              htmlFor="nicknameInput"
              className="w-full px-6 py-4 flex justify-between items-center bg-secondary-50 border border-gray-500 rounded-2xl outline-0 focus-within:ring-1 focus-within:ring-secondary-800"
            >
              <input
                id="nicknameInput"
                type="text"
                value={nickname}
                onChange={(e) => onChangeNickname(e.target.value)}
                placeholder="닉네임을 입력해주세요."
                disabled={busy.info}
                aria-invalid={!!getMessage(fieldNick)}
                aria-describedby="nickname-help nickname-error"
                className="flex-1 bg-transparent outline-0"
              />
              <span className="text-xs text-text-secondary/50 break-keep" id="nickname-help">
                <strong className={nickname.length > maxNicknameLength ? 'text-error-500' : ''}>
                  {nickname.length}
                </strong>{' '}
                / {maxNicknameLength}
              </span>
            </label>
          ) : (
            <>
              {initialNickname ? (
                <span className="text-text-primary font-bold text-xl">{initialNickname}</span>
              ) : (
                <span className="text-text-secondary/50">닉네임이 없습니다.</span>
              )}
            </>
          )}
          {getMessage(fieldNick) && (
            <p id="nickname-error" role="alert" aria-live="polite" className="text-error-500">
              {getMessage(fieldNick)}
            </p>
          )}
        </div>
        {/* Phone Section */}
        <div className="w-1/3 flex flex-col gap-2">
          <span className="text-gray-500 w-full font-light">Phone</span>
          {isEditing ? (
            <label htmlFor="phoneInput" className="flex flex-col gap-1">
              <PhoneInput
                id="phoneInput"
                value={phone}
                onChange={onChangePhone}
                disabled={busy.info}
                aria-invalid={!!getMessage(fieldPhone)}
                aria-describedby="phone-error"
              />
            </label>
          ) : (
            <>
              {initialPhone ? (
                <span className="text-text-primary font-bold text-xl">
                  {formatPhoneNumber(initialPhone)}
                </span>
              ) : (
                <span className="text-text-secondary/50">연락처 정보가 없습니다.</span>
              )}
            </>
          )}
          {getMessage(fieldPhone) && (
            <p id="phone-error" role="alert" aria-live="polite" className="text-error-500">
              {getMessage(fieldPhone)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
export default SettingPersonalInfo;
