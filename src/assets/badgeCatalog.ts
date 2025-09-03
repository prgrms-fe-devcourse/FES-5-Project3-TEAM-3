export type BadgeCategory = 'Onboarding' | 'Activity' | 'Community' | 'Collection' | 'Pairing';

export type Badge = {
  code: string; // 파일명/식별자 (예: "DessertSweetener")
  title: string; // 영문 표시명
  koTitle: string; // 한글 표시명
  category: BadgeCategory; // 그룹
  condition: string; // 달성 조건(영문)
  conditionKo: string; // 달성 조건(한글)
  icon: string; // /badge/${code}.png
  sort: number; // 정렬용
};

export const BADGE_CATALOG: Badge[] = [
  // === 기본 참여 ===
  {
    code: 'FirstSip',
    title: 'First Sip',
    koTitle: '첫 잔',
    category: 'Onboarding',
    condition: 'Create your first community post (tasting note).',
    conditionKo: '첫 번째 커뮤니티 글(시음 후기)을 작성하면 획득',
    icon: '/badge/FirstSip.png',
    sort: 10,
  },
  {
    code: 'WineCollector',
    title: 'Wine Collector',
    koTitle: '와인 콜렉터',
    category: 'Onboarding',
    condition: 'Have 50+ wines in your wishlist.',
    conditionKo: '위시리스트에 와인을 50개 이상 담으면 획득',
    icon: '/badge/WineCollector.png',
    sort: 20,
  },

  // === 활동량(리뷰 수 기준) ===
  {
    code: 'NoviceTaster',
    title: 'Novice Taster',
    koTitle: '와인 입문자',
    category: 'Activity',
    condition: 'Write your first wine review.',
    conditionKo: '와인 리뷰를 1개 작성하면 획득',
    icon: '/badge/NoviceTaster.png',
    sort: 110,
  },
  {
    code: 'WineExplorer',
    title: 'Wine Explorer',
    koTitle: '와인 탐험가',
    category: 'Activity',
    condition: 'Write 5 wine reviews.',
    conditionKo: '와인 리뷰를 5개 작성하면 획득',
    icon: '/badge/WineExplorer.png',
    sort: 120,
  },
  {
    code: 'ApprenticeSommelier',
    title: 'Apprentice Sommelier',
    koTitle: '소믈리에의 길',
    category: 'Activity',
    condition: 'Write 10 wine reviews.',
    conditionKo: '와인 리뷰를 10개 작성하면 획득',
    icon: '/badge/ApprenticeSommelier.png',
    sort: 130,
  },
  {
    code: 'VintageLover',
    title: 'Vintage Lover',
    koTitle: '빈티지 애호가',
    category: 'Activity',
    condition: 'Write 50+ wine reviews.',
    conditionKo: '와인 리뷰를 50개 이상 작성하면 획득',
    icon: '/badge/VintageLover.png',
    sort: 140,
  },
  {
    code: 'MasterTaster',
    title: 'Master Taster',
    koTitle: '마스터 테이스터',
    category: 'Activity',
    condition: 'Write 100+ wine reviews.',
    conditionKo: '와인 리뷰를 100개 이상 작성하면 획득',
    icon: '/badge/MasterTaster.png',
    sort: 150,
  },

  // === 커뮤니티 공헌 ===
  {
    code: 'WinepediaPioneer',
    title: 'Winepedia Pioneer',
    koTitle: '와인피디아 개척자',
    category: 'Community',
    condition: 'Post 10+ community posts during 2025 (early service phase).',
    conditionKo: '서비스 초기에 커뮤니티 글을 10개 이상 작성하면 획득',
    icon: '/badge/WinepediaPioneer.png',
    sort: 210,
  },
  {
    code: 'Cheerleader',
    title: 'Cheerleader',
    koTitle: '치어리더',
    category: 'Community',
    condition: 'Give 50+ likes to others’ posts/reviews/replies.',
    conditionKo: '다른 유저의 글/리뷰/댓글에 좋아요를 50회 이상 누르면 획득',
    icon: '/badge/Cheerleader.png',
    sort: 220,
  },
  {
    code: 'WineDocent',
    title: 'Wine Docent',
    koTitle: '와인 도슨트',
    category: 'Community',
    condition: 'Post 50+ community tasting notes.',
    conditionKo: '커뮤니티 시음 후기를 50개 이상 작성하면 획득',
    icon: '/badge/WineDocent.png',
    sort: 230,
  },

  // === 와인 컬렉션(카테고리별 리뷰 수) ===
  {
    code: 'RedLover',
    title: 'Red Lover',
    koTitle: '레드 러버',
    category: 'Collection',
    condition: 'Write 10+ reviews of Red wine.',
    conditionKo: '레드와인 리뷰를 10회 이상 작성하면 획득',
    icon: '/badge/RedLover.png',
    sort: 310,
  },
  {
    code: 'WhiteDreamer',
    title: 'White Dreamer',
    koTitle: '화이트 드리머',
    category: 'Collection',
    condition: 'Write 10+ reviews of White wine.',
    conditionKo: '화이트와인 리뷰를 10회 이상 작성하면 획득',
    icon: '/badge/WhiteDreamer.png',
    sort: 320,
  },
  {
    code: 'DessertSweetener',
    title: 'Dessert Sweetener',
    koTitle: '디저트 스위트너',
    category: 'Collection',
    condition: 'Write 10+ reviews of Dessert wine.',
    conditionKo: '디저트와인 리뷰를 10회 이상 작성하면 획득',
    icon: '/badge/DessertSweetener.png',
    sort: 330,
  },

  // === 페어링(리뷰 ↔ pairing_category) ===
  {
    code: 'MeatLover',
    title: 'Meat Lover',
    koTitle: '육식주의자',
    category: 'Pairing',
    condition: 'Post 10+ pairings with red meat.',
    conditionKo: '고기와의 페어링 후기를 10회 이상 작성하면 획득',
    icon: '/badge/MeatLover.png',
    sort: 410,
  },
  {
    code: 'Vegetarian',
    title: 'Vegetarian',
    koTitle: '채식주의자',
    category: 'Pairing',
    condition: 'Post 10+ pairings with vegetables.',
    conditionKo: '채소와의 페어링 후기를 10회 이상 작성하면 획득',
    icon: '/badge/Vegetarian.png',
    sort: 420,
  },
  {
    code: 'CheeseLover',
    title: 'Cheese Lover',
    koTitle: '치즈러버',
    category: 'Pairing',
    condition: 'Post 10+ pairings with cheese.',
    conditionKo: '치즈와의 페어링 후기를 10회 이상 작성하면 획득',
    icon: '/badge/CheeseLover.png',
    sort: 430,
  },
  {
    code: 'WillyWonka',
    title: 'Willy Wonka',
    koTitle: '윌리웡카',
    category: 'Pairing',
    condition: 'Post 10+ pairings with dessert.',
    conditionKo: '디저트와의 페어링 후기를 10회 이상 작성하면 획득',
    icon: '/badge/WillyWonka.png',
    sort: 440,
  },
  {
    code: 'KindTiger',
    title: 'Kind Tiger',
    koTitle: 'Kind Tiger',
    category: 'Pairing',
    condition: 'Post 10+ pairings with seafood.',
    conditionKo: '회/해산물과의 페어링 후기를 10회 이상 작성하면 획득',
    icon: '/badge/KindTiger.png',
    sort: 450,
  },
];
