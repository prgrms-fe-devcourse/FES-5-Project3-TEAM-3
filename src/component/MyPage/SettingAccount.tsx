import Button from '../Button';

function SettingAccount() {
  return (
    <section className="w-full p-8 rounded-lg bg-secondary-100 border border-gray-300 flex flex-col gap-6">
      <div className="flex justify-between">
        <h3 className="font-bold text-2xl">Account Setting</h3>
      </div>
      <hr />
      <div className="flex gap-6 justify-start items-center flex-col w-full">
        <div className="flex justify-between items-center w-full">
          <span className="text-text-primary text-lg">비밀번호 변경</span>
          <Button size="md" borderType="solid" color="primary">
            Change Password
          </Button>
        </div>
        <div className="flex justify-between items-center w-full">
          <span className="text-text-primary text-lg">회원탈퇴</span>
          <Button size="md" borderType="outline" color="primary">
            Unregister
          </Button>
        </div>
      </div>
    </section>
  );
}
export default SettingAccount;
