import SettingAccount from '@/component/MyPage/SettingAccount';
import SettingBio from '@/component/MyPage/SettingBio';
import SettingImage from '@/component/MyPage/SettingImage';
import SettingPersonalInfo from '@/component/MyPage/SettingPersonalInfo';

function Settings() {
  return (
    <div className="flex flex-col gap-12 overflow-scroll">
      <h2 className="w-full inline-flex flex-col justify-start items-start text-2xl font-semibold">
        Settings
      </h2>
      <SettingImage />
      <SettingPersonalInfo />
      <SettingBio />
      <SettingAccount />
    </div>
  );
}
export default Settings;
