import { useEffect, useRef, useState } from 'react';
import { ErrorCode } from './profileErrorCodes';
import { useProfileSettingError } from '@/hook/useProfileSettingError';
import { uploadImage } from '@/utils/supabase/uploadImage';
import Button from '../Button';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

function SettingImage() {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { busy, setBusy, setError, clearError, getMessage } = useProfileSettingError();
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadAbortRef = useRef<AbortController | null>(null);

  // preview URL 갱신 / unmount시 revoke
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const fieldKey = 'avatar';

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEditing(true);
    const file = e.target.files?.[0];

    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview);
    }

    // Error Message Handling
    if (!file) {
      setAvatar(null);
      setAvatarPreview(null);
      clearError(fieldKey);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError(fieldKey, ErrorCode.InvalidFileType);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(fieldKey, ErrorCode.FileTooLarge);
      return;
    }

    // 파일 미리보기 설정
    clearError(fieldKey);
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async () => {
    if (!avatar) {
      setError(fieldKey, ErrorCode.FileUploadFail);
      return;
    }

    const extension = avatar.name.split('.').pop()?.toLowerCase() || 'png';
    const filePath = `userAvatar-userId.${extension}`;

    setBusy('image', true);
    uploadAbortRef.current?.abort();
    uploadAbortRef.current = new AbortController();

    try {
      const result = await uploadImage({
        bucketName: 'user_avatar',
        file: avatar,
        path: filePath,
        signal: uploadAbortRef.current.signal,
      });

      if (result.success) {
        clearError(fieldKey);
        setIsEditing(false);
        return result.url;
      } else {
        console.error('Avatar Upload Failed:', result.error);
        setError(fieldKey, ErrorCode.AvatarUploadFail);
        return null;
      }
    } catch (err) {
      console.error('Avatar Upload Failed:', err);
      setError(fieldKey, ErrorCode.Unexpected);
      return null;
    } finally {
      setBusy('image', false);
      uploadAbortRef.current = null;
    }
  };

  const cancelUploadAvatar = () => {
    const ok = confirm('프로필 이미지 변경을 취소하시겠습니까?');
    if (!ok) return;

    uploadAbortRef.current?.abort();
    uploadAbortRef.current = null;

    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatar(null);
    setAvatarPreview(null);
    clearError(fieldKey);
    setIsEditing(false);

    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <section className="w-full p-8 rounded-lg bg-secondary-100 border border-gray-300 flex flex-col gap-6">
      <div className="flex justify-between">
        <h3 className="font-bold text-2xl">Profile Image</h3>
        {isEditing && (
          <div className="buttonGroup flex items-center justify-end gap-2">
            <Button
              type="button"
              size="sm"
              color="primary"
              borderType="solid"
              hasIcon
              onClick={uploadAvatar}
            >
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              color="primary"
              borderType="outline"
              hasIcon
              onClick={cancelUploadAvatar}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
      <hr />
      <div className="flex gap-6 justify-start items-center">
        <div className="size-25 border border-secondary-800/40 rounded-full flex justify-center items-center">
          {avatarPreview ? (
            <img src={avatarPreview} alt="프로필사진" className="size-25 rounded-full" />
          ) : (
            <div className="bg-slate-500"></div>
          )}
        </div>
        <label htmlFor="avatarInput" className="flex flex-col gap-2">
          <input
            type="file"
            id="avatarInput"
            ref={fileRef}
            accept="image/*"
            onChange={handleAvatarFile}
            disabled={busy.image}
            className="hidden"
          />
          <Button
            borderType="outline"
            color="primary"
            hasIcon
            onClick={() => !busy.image && fileRef.current?.click()}
          >
            <img src="/icon/edit.svg" alt="수정 아이콘" />
            <span className="font-semibold">프로필 이미지 변경하기</span>
          </Button>
          {avatarPreview && (
            <span className="text-slate-400 text-sm font-light">
              현재 업로드 파일: {avatar?.name}
            </span>
          )}
        </label>
      </div>
      {getMessage('avatar') && (
        <p role="alert" aria-live="polite" className="text-error-500">
          {getMessage('avatar')}
        </p>
      )}
    </section>
  );
}
export default SettingImage;
