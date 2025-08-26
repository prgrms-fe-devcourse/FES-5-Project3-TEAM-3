import type { WineInfoType } from '@/pages/wine/Wines';
import TastingInfo from '../tasting/TastingInfo';
import FlavorIcon from './FlavorIcon';

function WineInfo({ wineInfo }: { wineInfo: WineInfoType }) {
  const { title: name, images, grapes, country, alcohol_content, taste, scent } = wineInfo;

  const computedTaste = Object.fromEntries(
    Object.entries(taste).map(([k, v]) => {
      return v === null ? [k, null] : [k, Math.ceil(v * 0.05)];
    })
  ) as typeof taste;

  return (
    <div className="min-w-90 w-100 h-120 flex flex-col gap-2 px-12 py-8 m-8 items-stretch justify-between mx-auto rounded-xl bg-secondary-50 shadow-sm hover:shadow-2xl hover:bg-secondary-100 transition-transform duration-300 select-none">
      {/*전체카드 >  와인정보 + 설명*/}
      <div className="h-full flex justify-between items-center gap-8">
        {/*와인정보 >  이미지 + 정보*/}
        <img
          src={images[1] ?? images[0]}
          alt={name}
          className="w-15"
          draggable="false"
          onError={(e) => (e.currentTarget.src = 'image/wineImage.svg')}
        />
        <div className="flex flex-col justify-between align-baseline gap-1">
          {/*와인정보  : 영어이름+한국이름?+도수+향미료+맛(당도, 산미, 탄닌, 바디감)*/}
          <h3 className="text-2xl mb-4 text-text-primary">
            {name.length < 32 ? name : name.slice(0, 32) + ' ... '}
          </h3>
          {/* <p>
            소테른<span>{alcohol_content ? `[${alcohol_content}]` : ''}</span>
          </p> */}
          <div className="flex items-center gap-1.5  whitespace-nowrap font-normal text-text-secondary">
            <img
              src={`icon/country/${country}.svg`}
              alt={country}
              className="w-6 h-6"
              draggable="false"
              onError={(e) => {
                // 이미지 로드 실패 시 대체 이미지로 교체
                e.currentTarget.src = 'icon/country/others.svg';
              }}
            />
            {country}
            <img src="icon/wine.svg" alt="도수" className="w-6 h-6" draggable="false" />
            {alcohol_content ?? '정보없음'}
          </div>

          <div className="flex items-center gap-1.5 mb-4 whitespace-nowrap font-normal text-text-secondary">
            <img src="icon/grape.svg" alt="포도종류아이콘" className="w-5 h-5" draggable="false" />
            {grapes.length > 1 ? grapes[0] + ' +' + (grapes.length - 1) : grapes}
          </div>
          <TastingInfo tasting={computedTaste} style="info" />
        </div>
      </div>
      <div className="grid grid-rows-1 grid-cols-5 items-center justify-center group pt-2 mb-2">
        {scent.map((s) => (
          <FlavorIcon flavor={s} key={s} />
        ))}
      </div>
    </div>
  );
}

export default WineInfo;
