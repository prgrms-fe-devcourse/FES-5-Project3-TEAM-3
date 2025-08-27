import { useProfileSettingError } from '@/hook/useProfileSettingError';
import Button from '../Button';
import React, { useEffect, useState } from 'react';
import { ErrorCode } from './profileErrorCodes';

interface BioProps {
  initialBio?: string | null;
  maxLength?: number;
}

function SettingBio({ initialBio = '', maxLength = 300 }: BioProps) {
  const fieldKey = 'bio' as const;
  const { busy, setBusy, setError, clearError, getMessage } = useProfileSettingError();

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(initialBio ?? '');

  useEffect(() => {
    if (!isEditing) setBio(initialBio ?? '');
  }, [initialBio, isEditing]);

  const hasChanged = initialBio !== bio;

  const startEditBio = () => {
    setIsEditing(true);
    clearError(fieldKey);
  };

  const handleEditBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setBio(input);

    if (input.length > maxLength) {
      setError(fieldKey, ErrorCode.BioTooLong);
    } else {
      if (getMessage(fieldKey)) {
        clearError(fieldKey);
      }
    }
  };

  const validateBio = (value: string) => {
    if (value.trim().length > maxLength) {
      setError(fieldKey, ErrorCode.BioTooLong);
      return false;
    }

    if (value.trim().length === 0) {
      setBio('');
    }

    return true;
  };

  const saveBio = () => {
    clearError(fieldKey);

    if (!hasChanged) {
      setIsEditing(false);
      return;
    }

    if (!bio || !validateBio(bio)) return;

    setBusy('bio', true);
    try {
      console.log('saved!');

      // res.success
      clearError(fieldKey);
      setIsEditing(false);
    } catch (err) {
      console.error('error');
    } finally {
      setBusy('bio', false);
    }
  };

  const cancelEditBio = () => {
    if (hasChanged) {
      const ok = confirm('수정 중인 내용은 저장되지 않습니다. 정말 취소하시겠습니까?');
      if (!ok) return;
    }

    setBio(initialBio ?? '');
    clearError(fieldKey);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter => Save
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!busy.bio) void saveBio();
    }

    // ESC => Cancel
    if (e.key === 'Escape') {
      e.preventDefault();
      cancelEditBio();
    }
  };

  return (
    <section className="w-full p-8 rounded-lg bg-secondary-100 border border-gray-300 flex flex-col gap-6">
      <div className="flex justify-between">
        <h3 className="font-bold text-2xl">Bio</h3>
        <div className="buttonGroup flex items-center justify-end gap-2">
          {isEditing ? (
            <>
              <Button
                type="button"
                size="sm"
                color="primary"
                borderType="solid"
                hasIcon
                disabled={!!getMessage(fieldKey)}
                onClick={saveBio}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                color="primary"
                borderType="outline"
                hasIcon
                onClick={cancelEditBio}
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
              onClick={startEditBio}
            >
              <img src="/icon/edit.svg" alt="수정 아이콘" />
              <span>Edit</span>
            </Button>
          )}
        </div>
      </div>
      <hr />
      {isEditing ? (
        <div>
          <textarea
            value={bio}
            onChange={handleEditBio}
            onKeyDown={handleKeyDown}
            rows={6}
            aria-invalid={!!getMessage(fieldKey)}
            aria-describedby="bio-help bio-error"
            className="w-full rounded-lg border border-secondary-800/40 p-3 outline-none focus:ring-1 focus:ring-secondary-800 bg-secondary-50"
          />
          <div className="flex items-center justify-between text-sm text-text-secondary/50">
            <span id="bio-help">⌘/Ctrl + Enter 저장 · ESC 취소</span>
            <span>
              <strong className={bio.length > maxLength ? 'text-error-500' : ''}>
                {bio.length}
              </strong>{' '}
              / {maxLength}
            </span>
          </div>

          {getMessage(fieldKey) && (
            <p id="bio-error" role="alert" aria-live="polite" className="text-error-500 pt-4">
              {getMessage(fieldKey)}
            </p>
          )}
        </div>
      ) : (
        <p>
          {bio?.trim() ? (
            bio
          ) : (
            <span className="text-text-secondary/50">
              저장된 자기소개 글이 없습니다. 소개글을 입력해보세요!
            </span>
          )}
        </p>
      )}
    </section>
  );
}
export default SettingBio;
