import { useState } from 'react';
import { ErrorCode } from './settingErrorCodes';
import { useProfileSettingError } from '@/hook/useProfileSettingError';
import { uploadImage } from '@/utils/supabase/uploadImage';
import Button from '../Button';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

function SettingImage() {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { busy, setBusy, setError, clearError, getMessage } = useProfileSettingError();
  const fieldKey = 'avatar';

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Error Message Handling
    if (!file) {
      setError(fieldKey, ErrorCode.FileTooLarge);
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
    try {
      const result = await uploadImage({
        bucketName: 'user_avatar',
        file: avatar,
        path: filePath,
      });

      if (result.success) {
        clearError(fieldKey);
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
    }
  };

  return (
    <div className="w-full p-8 rounded-lg bg-secondary-100 border border-gray-300 flex flex-col gap-6">
      <div className="flex justify-between">
        <h3 className="font-bold text-2xl">Profile Image</h3>
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
          <Button type="button" size="sm" color="primary" borderType="outline" hasIcon>
            Cancel
          </Button>
        </div>
      </div>
      <hr />
      <div className="flex gap-6 justify-start items-center">
        <div className="size-25 bg-slate-500 rounded-full">
          {avatarPreview ? <img src={avatarPreview} alt="프로필사진" /> : <></>}
        </div>
        <input type="file" accept="image/*" onChange={handleAvatarFile} disabled={busy.image} />
      </div>
      {getMessage('avatar') && (
        <p role="alert" aria-live="polite">
          {getMessage('avatar')}
        </p>
      )}
    </div>
  );
}
export default SettingImage;
