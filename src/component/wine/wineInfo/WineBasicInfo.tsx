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
    title: name,
    country,
    alcohol_content,
    grapes,
    taste,
    wine_description,
    category,
    scent,
  } = wineBasicInfo;
  const computedTaste = computeTaste(taste);
  const wineType = category.split(' ')[0].toLowerCase();
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
        type === 'detail' && 'gap-2 w-1/3 px-10'
      )}
    >
      {/*와인정보  : 영어이름+한국이름?+도수+향미료+맛(당도, 산미, 탄닌, 바디감)*/}
      <h3 className={clsx(' text-2xl mb-4 text-text-primary', type === 'detail' && 'text-3xl')}>
        {type === 'default' ? truncateText(name, 32) : name}
        {type === 'detail' && (
          <span
            className={clsx(
              'w-fit px-3 text-text-primary shadow-sm rounded-xl text-lg ml-3',
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
          src={`/icon/country/${country}.svg`}
          alt={country}
          className="w-6 h-6"
          draggable="false"
          onError={(e) => {
            // 이미지 로드 실패 시 대체 이미지로 교체
            e.currentTarget.src = '/icon/country/others.svg';
          }}
        />
        {country}
        <img src="/icon/wine.svg" alt="도수" className="w-6 h-6" draggable="false" />
        {alcohol_content ?? '정보없음'}
      </div>

      <div
        className={clsx(
          'flex items-center gap-1.5 mb-4 whitespace-nowrap font-normal text-text-secondary',
          type === 'detail' && 'text-lg'
        )}
      >
        <img src="/icon/grape.svg" alt="포도종류아이콘" className="w-5 h-5" draggable="false" />
        {type === 'default'
          ? grapes.length > 1
            ? grapes[0] + ' +' + (grapes.length - 1)
            : grapes
          : grapes.join(' / ')}
      </div>
      {type === 'default' ? (
        <TastingInfo tasting={computedTaste} style="info" />
      ) : (
        <>
          <p className="self-center mb-3 text-text-secondary">
            {wine_description === '' ? '설명없음' : wine_description}
          </p>
          <p className="text-text-secondary">주요향미료</p>
          <div className="grid grid-rows-1 grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 items-center justify-center group py-2">
            {scent.map((s) => (
              <FlavorIcon flavor={s} key={s} type="large" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default WineBasicInfo;
