import HomeIconActive from '@/assets/MyPageIcon/home-black.svg';
import HomeIcon from '@/assets/MyPageIcon/home.svg';
import WineSellerIconActive from '@/assets/MyPageIcon/wine-seller-black.svg';
import WineSellerIcon from '@/assets/MyPageIcon/wine-seller.svg';
import WishListIconActive from '@/assets/MyPageIcon/wish-list-black.svg';
import WishListIcon from '@/assets/MyPageIcon/wish-list.svg';
import ActivityIconActive from '@/assets/MyPageIcon/activity-black.svg';
import ActivityIcon from '@/assets/MyPageIcon/activity.svg';
import AchievementIconActive from '@/assets/MyPageIcon/achievement-black.svg';
import AchievementIcon from '@/assets/MyPageIcon/achievement.svg';
import SettingsIconActive from '@/assets/MyPageIcon/settings-black.svg';
import SettingsIcon from '@/assets/MyPageIcon/settings.svg';

export type IconPair = {
  default: string;
  active: string;
};

export const MyPageIcons: Record<string, IconPair> = {
  '/my-page/home': {
    default: HomeIcon,
    active: HomeIconActive,
  },
  '/my-page/wine-seller': {
    default: WineSellerIcon,
    active: WineSellerIconActive,
  },
  '/my-page/wish-list': {
    default: WishListIcon,
    active: WishListIconActive,
  },
  '/my-page/activity': {
    default: ActivityIcon,
    active: ActivityIconActive,
  },
  '/my-page/achievement': {
    default: AchievementIcon,
    active: AchievementIconActive,
  },
  '/my-page/settings': {
    default: SettingsIcon,
    active: SettingsIconActive,
  },
};
