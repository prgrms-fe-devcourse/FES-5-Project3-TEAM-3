import type { WineInfoType } from '@/pages/wine/Wines';
import TastingInfo from '../tasting/TastingInfo';
import clsx from 'clsx';
import FlavorIcon from './FlavorIcon';
import { computeTaste } from '@/utils/convertTasteInfo';
import truncateText from '@/utils/truncateText';

interface WineBasicInfoType {
  wineBasicInfo: WineInfoType;
  type?: 'default' | 'detail';
}

function WineBasicInfo({ wineBasicInfo, type = 'default' }: WineBasicInfoType) {
  const {
    name,
    country,
    country_ko,
    abv,
    variety,
    sweetness,
    acidic,
    tannic,
    body,
    description,
    category,
    representative_flavor_ko,
    representative_flavor,
  } = wineBasicInfo;
  const computedTaste = computeTaste({ sweetness, acidic, tannic, body }) as {
    sweetness: number;
    acidic: number;
    tannic: number;
    body: number;
  };
  const wineType = category ? category.split(' ')[0].toLowerCase() : '';
  const wineTypeStyle: { [wineType]: string } = {
    red: 'bg-primary-300 text-white',
    white: 'bg-secondary-100',
    sparkling: 'bg-secondary-300 ',
    rose: 'bg-primary-200/80 ',
    dessert: 'bg-secondary-500/60',
  };

  return (
    <div
      className={clsx(
        'flex flex-col justify-between align-baseline gap-1 text-lg',
        type === 'detail' && 'gap-2 w-3/4 md:w-1/3 min-w-60'
      )}
    >
      {/*와인정보  : 영어이름+한국이름?+도수+향미료+맛(당도, 산미, 탄닌, 바디감)*/}
      <h3
        className={clsx(
          ' text-2xl mb-4 text-text-primary',
          type === 'detail' && 'text-3xl select-text'
        )}
      >
        {type === 'default' ? truncateText(name, 32) : name}
        {type === 'detail' && (
          <span
            className={clsx(
              'w-fit px-3 text-text-primary shadow-sm rounded-xl text-lg ml-3 select-none',
              wineTypeStyle[wineType]
            )}
          >
            {wineType}
          </span>
        )}
      </h3>
      {/* <p>
            소테른<span>{alcohol_content ? `[${alcohol_content}]` : ''}</span>
          </p> */}
      <div
        className={clsx(
          'flex items-center gap-1.5  whitespace-nowrap font-normal text-text-secondary',
          type === 'detail' && 'text-lg'
        )}
      >
        <img
          src={country_ko ? `/icon/country/${country}.svg` : '/icon/country/others.svg'}
          alt={country_ko ?? '와인생산국가'}
          className="w-6 h-6"
          draggable="false"
          onError={(e) => {
            // 이미지 로드 실패 시 대체 이미지로 교체
            e.currentTarget.src = '/icon/country/others.svg';
          }}
        />
        {country_ko ?? '정보없음'}
        <img src="/icon/wine.svg" alt="도수" className="w-6 h-6" draggable="false" />
        {abv ?? '정보없음'}
      </div>

      <div
        className={clsx(
          'flex items-center gap-1.5 mb-4 whitespace-nowrap font-normal text-text-secondary',
          type === 'detail' && 'text-lg'
        )}
      >
        <img src="/icon/grape.svg" alt="포도종류아이콘" className="w-5 h-5" draggable="false" />
        {type === 'default'
          ? variety.length > 1
            ? variety[0] + ' +' + (variety.length - 1)
            : variety
          : variety.join(' / ')}
      </div>
      {type === 'default' ? (
        <TastingInfo tasting={computedTaste} style="info" />
      ) : (
        <>
          <p className="mb-3 text-text-secondary">
            {description === '' ? '설명없음' : description}
          </p>
          <p className="text-text-secondary">주요향미료</p>
          <div className="grid grid-cols-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 items-center justify-center group py-2">
            {representative_flavor_ko && representative_flavor ? (
              representative_flavor_ko.map((s, i) => (
                <FlavorIcon flavor={s} key={s} flavoren={representative_flavor[i]} type="large" />
              ))
            ) : (
              <p className="col-span-full text-text-secondary">flavor 정보가 없습니다</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default WineBasicInfo;
