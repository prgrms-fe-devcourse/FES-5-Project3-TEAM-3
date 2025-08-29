import ReviewRatings from '@/component/wine/wineDetailInfo/ReviewRatings';
import TastingReviewChart from '@/component/wine/wineDetailInfo/TastingReviewChart';
import WineBasicInfo from '@/component/wine/wineInfo/WineBasicInfo';
import wineData from '@/data/data.json';
import { computeTaste } from '@/utils/convertTasteInfo';
import { useState } from 'react';
import { useParams } from 'react-router';

function WineDetails() {
  // 데이터 fetch -> props로 못 받음 : supabase에 올려서 디테일정보 가져오기, 주소도 와인인덱스말고 id로 하기
  const { wineId } = useParams();
  const [rating] = useState(3.7); // supabase에서 가져오기
  if (!wineId) return;

  const wine = wineData[Number(wineId)];
  const { images, title: name, taste } = wine;
  const computedTaste = computeTaste(taste);
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="h-full flex justify-center items-center gap-10 p-5 flex-col md:flex-row">
        <img
          src={images[1] ?? images[0]}
          alt={name}
          className="h-full"
          draggable="false"
          onError={(e) => (e.currentTarget.src = '/image/wineImage.svg')}
        />
        <WineBasicInfo wineBasicInfo={wine} type="detail" />
        <div className="flex flex-col justify-center items-center p-5 gap-10">
          <div className="h-80">
            <p className="flex justify-end items-center gap-2">
              리뷰<span className="rounded-full bg-secondary-300 w-4 h-4"></span>공식
              <span className="rounded-full bg-primary-500 w-4 h-4"></span>
            </p>
            <TastingReviewChart
              infoData={[
                computedTaste.sweetness ?? 0,
                computedTaste.acidic ?? 0,
                computedTaste.tannic ?? 0,
                computedTaste.body ?? 0,
              ]}
              reviewData={[1, 2, 3, 4]}
            />
          </div>
          <div className="h-fit flex justify-center w-full">
            <p className="m-auto text-lg">리뷰</p>
            <ReviewRatings rating={rating} />
            <p className="m-auto">{rating}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WineDetails;
