import SettingImage from '@/component/MyPage/SettingImage';

function Settings() {
  return (
    <div className="flex flex-col gap-12 overflow-scroll">
      <h2 className="w-full inline-flex flex-col justify-start items-start text-2xl font-semibold">
        Settings
      </h2>
      <SettingImage />
    </div>
  );
}
export default Settings;
