export type LangInfo = {
  ko: string;
  en: string;
};

export type minMaxInfo = {
  min: number;
  max?: number;
};

export const countryInfo: Record<string, LangInfo & { icon: string }> = {
  프랑스: { ko: '프랑스', en: 'France', icon: '/icon/country/France.svg' },
  이탈리아: { ko: '이탈리아', en: 'Italy', icon: '/icon/country/Italy.svg' },
  스페인: { ko: '스페인', en: 'Spain', icon: '/icon/country/Spain.svg' },
  미국: { ko: '미국', en: 'United States', icon: '/icon/country/United-states.svg' },
  칠레: { ko: '칠레', en: 'Chile', icon: '/icon/country/Chile.svg' },
  호주: { ko: '호주', en: 'Australia', icon: '/icon/country/Australia.svg' },
  남아프리카공화국: {
    ko: '남아프리카공화국',
    en: 'South Africa',
    icon: '/icon/country/South-africa.svg',
  },
  아르헨티나: { ko: '아르헨티나', en: 'Argentina', icon: '/icon/country/Argentina.svg' },
  독일: { ko: '독일', en: 'Germany', icon: '/icon/country/Germany.svg' },
  포르투갈: { ko: '포르투갈', en: 'Portugal', icon: '/icon/country/Portugal.svg' },

  루마니아: { ko: '루마니아', en: 'Romania', icon: '/icon/country/Romania.svg' },
  러시아: { ko: '러시아', en: 'Russia', icon: '/icon/country/Russia.svg' },
  뉴질랜드: { ko: '뉴질랜드', en: 'New Zealand', icon: '/icon/country/New-zealand.svg' },
  브라질: { ko: '브라질', en: 'Brazil', icon: '/icon/country/Brazil.svg' },
  중국: { ko: '중국', en: 'China', icon: '/icon/country/China.svg' },
  헝가리: { ko: '헝가리', en: 'Hungary', icon: '/icon/country/Hungary.svg' },
  오스트리아: { ko: '오스트리아', en: 'Austria', icon: '/icon/country/Austria.svg' },
  조지아: { ko: '조지아', en: 'Georgia', icon: '/icon/country/Georgia.svg' },
  몰도바: { ko: '몰도바', en: 'Moldova', icon: '/icon/country/Moldova.svg' },
  그리스: { ko: '그리스', en: 'Greece', icon: '/icon/country/Greece.svg' },
  스위스: { ko: '스위스', en: 'Switzerland', icon: '/icon/country/Switzerland.svg' },
  불가리아: { ko: '불가리아', en: 'Bulgaria', icon: '/icon/country/Bulgaria.svg' },
  일본: { ko: '일본', en: 'Japan', icon: '/icon/country/Japan.svg' },
  슬로베니아: { ko: '슬로베니아', en: 'Slovenia', icon: '/icon/country/Slovenia.svg' },
  세르비아: { ko: '세르비아', en: 'Moldova', icon: '/icon/country/Serbia.svg' },
  우루과이: { ko: '우루과이', en: 'Uruguay', icon: '/icon/country/Uruguay.svg' },
  체코: { ko: '체코', en: 'Czech Republic', icon: '/icon/country/Czechia.svg' },
  크로아티나: { ko: '크로아티나', en: 'Croatia', icon: '/icon/country/Croatia.svg' },
  멕시코: { ko: '멕시코', en: 'Mexico', icon: '/icon/country/Mexico.svg' },
  아르메니아: { ko: '아르메니아', en: 'Armenia', icon: '/icon/country/Armenia.svg' },
  룩셈부르크: { ko: '룩셈부르크', en: 'Luxembourg', icon: '/icon/country/Luxembourg.svg' },
  벨기에: { ko: '벨기에', en: 'Belgium', icon: '/icon/country/Belgium.svg' },
  네덜란드: { ko: '네덜란드', en: 'Netherlands', icon: '/icon/country/Netherlands.svg' },

  
  '보스니아 헤르체고비나': {
    ko: '보스니아 헤르체고비나',
    en: 'Bosnia-and-Herzegovina',
    icon: '/icon/country/Bosnia-and-herzegovina.svg',
  },
  북마케도니아: {
    ko: '북마케도니아',
    en: 'North Macedonia',
    icon: '/icon/country/North-macedonia.svg',
  },
  캐나다: { ko: '캐나다', en: 'Canada', icon: '/icon/country/Canada.svg' },
  인도: { ko: '인도', en: 'India', icon: '/icon/country/India.svg' },
  이란: { ko: '이란', en: 'Iran', icon: '/icon/country/Iran.svg' },
  몬테네그로: { ko: '몬테네그로', en: 'Montenegro', icon: '/icon/country/Montenegro.svg' },
  폴란드: { ko: '폴란드', en: 'Poland', icon: '/icon/country/Poland.svg' },
  슬로바키아: { ko: '슬로바키아', en: 'Slovakia', icon: '/icon/country/Slovakia.svg' },
  대한민국: { ko: '대한민국', en: 'Korea (South)', icon: '/icon/country/South-korea.svg' },
  태국: { ko: '태국', en: 'Thailand', icon: '/icon/country/Thailand.svg' },
  터키: { ko: '터키', en: 'Turkey', icon: '/icon/country/Turkey.svg' },
  우크라이나: { ko: '우크라이나', en: 'Ukraine', icon: '/icon/country/Ukraine.svg' },
  영국: { ko: '영국', en: 'United Kingdom', icon: '/icon/country/United-kingdom.svg' },
  베트남: { ko: '베트남', en: 'Vietnam', icon: '/icon/country/Vietnam.svg' },
};

export const grapes: Record<string, LangInfo & { similar?: string[] }> = {
  'Cabernet Sauvignon': { ko: '카베르네 소비뇽', en: 'Cabernet Sauvignon' },
  Merlot: { ko: '메를로', en: 'Merlot' },
  'Pinot Noir': {
    ko: '피노 누아',
    en: 'Pinot Noir',
    similar: ['Pinot Nero', 'Spätburgunder', 'Blauburgunder'],
  },
  'Shiraz/Syrah': { ko: '시라즈/시라', en: 'Shiraz/Syrah' },
  Malbec: { ko: '말벡', en: 'Malbec', similar: ['Côt'] },
  Grenache: {
    ko: '그르나슈/가르나차',
    en: 'Grenache',
    similar: ['Cannonau', 'Garnacha', 'Garnacha Tinta'],
  },
  'Cabernet Franc': { ko: '카베르네 프랑', en: 'Cabernet Franc' },
  'Sauvignon Blanc': { ko: '소비뇽 블랑', en: 'Sauvignon Blanc', similar: ['Fumé Blanc'] },
  Riesling: { ko: '리슬링', en: 'Riesling', similar: ['Riesling Renano'] },
};

export const type: Record<string, string> = {
  레드와인: 'Red wine',
  화이트와인: 'White wine',
  로제와인: 'Rosé wine',
  스파클링와인: 'Sparkling wine',
  디저트와인: 'Dessert wine',
};

export const alcohol: Record<string, minMaxInfo> = {
  논알콜: { min: 0, max: 0 },
  '0 - 5%': { min: 0, max: 5 },
  '5 - 10%': { min: 5, max: 10 },
  '10 - 15%': { min: 10, max: 15 },
  '15 - 20%': { min: 15, max: 20 },
  '20 - 25%': { min: 20, max: 25 },
  '25% 이상': { min: 25 },
};

export const tasteInfo: Record<string, { rating: number[] }> = {
  낮음: { rating: [1, 2] },
  중간: { rating: [3] },
  높음: { rating: [4, 5] },
};

export const bodyTasteInfo: Record<string, { rating: number[] }> = {
  가벼움: { rating: [1, 2] },
  중간: { rating: [3] },
  무거움: { rating: [4, 5] },
};

const basePairingCategory: Record<string, string> = {
  '고기-소,돼지': 'redMeat',
  '고기-닭': 'whiteMeat',
  '햄,소세지': 'ham_sausage_bacon',
  해산물: 'seafood',
  '치즈,유제품': 'cheese',
  채소: 'vegetable',
  '파스타,피자': 'pasta_pizza',
  디저트: 'dessert',
  '빵,간단안주': 'bread_simple_pairing',
  견과류: 'nuts',
  기타: 'others',
};

export const pairingCategory: Record<string, string> = Object.entries(basePairingCategory).reduce(
  (acc, [k, v]) => {
    acc[k] = v; // forward
    acc[v] = k; // reverse
    return acc;
  },
  {} as Record<string, string>
);
