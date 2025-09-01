import { useProfileSettingError } from '@/hook/profileSetting/useProfileSettingError';
import Button from '../Button';
import React, { useEffect, useState } from 'react';
import { ErrorCode } from './profileErrorCodes';
import { useAuth } from '@/store/@store';
import { useProfileBio, useUpdateBio } from '@/hook/profileSetting/useProfileBio';
import useToast from '@/hook/useToast';
import Spinner from '../Spinner';
import { useConfirm } from '@/hook/useConfirm';

interface BioProps {
  maxLength?: number;
}

function SettingBio({ maxLength = 300 }: BioProps) {
  const fieldKey = 'bio' as const;
  const { busy, setBusy, setError, clearError, getMessage } = useProfileSettingError();

  const profileId = useAuth((s) => s.userId);
  const isAuthLoading = useAuth((s) => s.isLoading);

  const { data, isLoading: bioLoading } = useProfileBio(profileId ?? undefined);
  const updateBio = useUpdateBio();

  const serverBio = data?.bio ?? '';

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(serverBio ?? '');

  const confirm = useConfirm();

  useEffect(() => {
    if (!isEditing) setBio(serverBio ?? '');
  }, [serverBio, isEditing]);

  const hasChanged = (serverBio ?? '') !== (bio ?? '');

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

  const saveBio = async () => {
    clearError(fieldKey);

    if (!hasChanged) {
      setIsEditing(false);
      return;
    }

    if (!profileId) {
      setError(fieldKey, ErrorCode.LoginSessionExpired);
      return;
    }

    if (!bio || !validateBio(bio)) return;

    setBusy('bio', true);
    try {
      const normalized = bio.trim().replace(/\r\n/g, '\n');
      await updateBio.mutateAsync({ profileId, bio: normalized });
      useToast('success', '소개글이 저장되었습니다.');
      clearError(fieldKey);
      setIsEditing(false);
    } catch (err) {
      console.error('error');
      useToast('error', '소개글 저장에 실패했습니다.');
      setError(fieldKey, ErrorCode.Unexpected);
    } finally {
      setBusy('bio', false);
    }
  };

  const cancelEditBio = async () => {
    if (hasChanged) {
      const ok = await confirm({
        title: '소개글 변경을 취소하시겠습니까?',
        description: <>변경 중인 사항은 저장되지 않습니다.</>,
        confirmText: '취소하기',
        cancelText: '돌아가기',
        tone: 'danger',
      });
      if (!ok) return;
    }

    setBio(serverBio);
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

  if (isAuthLoading || bioLoading || !profileId) {
    return (
      <section className="w-full p-8 rounded-lg bg-secondary-100 border border-gray-300 flex flex-col gap-6">
        <Spinner />
      </section>
    );
  }

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
        <p className="whitespace-pre-wrap break-words">
          {serverBio?.trim() ? (
            serverBio
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
