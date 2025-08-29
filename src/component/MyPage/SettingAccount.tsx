import { useConfirm } from '@/hook/useConfirm';
import Button from '../Button';
import useToast from '@/hook/useToast';
import { deactivateProfile } from '@/utils/supabase/unregister';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import ChangePasswordModal from './ChangePasswordModal';

function SettingAccount() {
  const confirm = useConfirm();
  const navigate = useNavigate();

  const [openPwChange, setOpenPwChange] = useState(false);

  const handleDeactivate = async () => {
    const ok = await confirm({
      title: '정말 탈퇴하시겠습니까?',
      description: (
        <>
          이 작업은 되돌릴 수 없습니다.
          <br />
          연결된 계정이 비활성화됩니다.
        </>
      ),
      confirmText: '계정 비활성화',
      cancelText: '취소',
      tone: 'danger',
    });

    if (!ok) return;
    try {
      await deactivateProfile();
      useToast('success', '계정이 비활성화되었습니다.');
      navigate('/');
    } catch (err: any) {
      useToast('error', err?.message ?? '처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <section className="w-full p-8 rounded-lg bg-secondary-100 border border-gray-300 flex flex-col gap-6">
      <div className="flex justify-between">
        <h3 className="font-bold text-2xl">Account Setting</h3>
      </div>
      <hr />
      <div className="flex gap-6 justify-start items-center flex-col w-full">
        <div className="flex justify-between items-center w-full">
          <span className="text-text-primary text-lg">비밀번호 변경</span>
          <Button
            size="md"
            borderType="solid"
            color="primary"
            onClick={() => setOpenPwChange(true)}
          >
            Change Password
          </Button>
          <ChangePasswordModal
            open={openPwChange}
            onClose={() => setOpenPwChange(false)}
            onSuccess={() => useToast('success', '비밀번호가 변경되었습니다.')}
          />
        </div>
        <div className="flex justify-between items-center w-full">
          <span className="text-text-primary text-lg">회원탈퇴</span>
          <Button size="md" borderType="outline" color="primary" onClick={handleDeactivate}>
            Deactivate
          </Button>
        </div>
      </div>
    </section>
  );
}
export default SettingAccount;
