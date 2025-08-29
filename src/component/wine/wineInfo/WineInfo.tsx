import type { WineInfoType } from '@/pages/wine/Wines';
import FlavorIcon from './FlavorIcon';
import WineBasicInfo from './WineBasicInfo';

function WineInfo({ wineInfo }: { wineInfo: WineInfoType }) {
  const { title: name, images, scent } = wineInfo;

  return (
    <div className="min-w-90 w-100 h-120 flex flex-col gap-2 px-12 py-8 m-8 items-stretch justify-between mx-auto rounded-xl bg-secondary-50 shadow-sm hover:shadow-2xl hover:bg-secondary-100 transition-transform duration-300 select-none">
      {/*전체카드 >  와인정보 + 향미료*/}
      <div className="h-full flex justify-between items-center gap-8">
        {/*와인정보 >  이미지 + 정보*/}
        <img
          src={images[1] ?? images[0]}
          alt={name}
          className="w-15"
          draggable="false"
          onError={(e) => (e.currentTarget.src = '/image/wineImage.svg')}
        />
        <WineBasicInfo wineBasicInfo={wineInfo} />
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
