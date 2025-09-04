import { useReviewStore } from '@/store/reviewStore';
import { useEffect, useState } from 'react';

function ReviewRatings({
  w = 'w-10', // 기본값 40px
  h = 'h-10', // 기본값 40px
  rating = 0, // 기본값 0
  type = 'readonly', // 기본값 읽기만가능
}: {
  w?: string;
  h?: string;
  rating?: number;
  type?: 'readonly' | 'select';
}) {
  const [selectedRating, setSelectedRating] = useState(rating); // rating을 받은 경우 rating, 안받았으면 0 (readonly일때는 rating 안주면 기본값 0)

  useEffect(() => setSelectedRating(rating), [rating]);
  const fullStars = Math.floor(selectedRating); // 선택된별점의 숫자부분
  const floatStars = Number((selectedRating % 1).toFixed(1)); // 선택된별점의 소수부분(1자리)
  const percentage: number[] = []; // percentage 5->[1,1,1,1,1], 3.5->[1,1,1,0.5,0]처럼 만들기위한것

  const setRating = useReviewStore((state) => state.setRating); // useReviewStore에서 별점저장하는 함수 가져오기

  const handleClick = (e: React.MouseEvent<HTMLImageElement>, index: number) => {
    // 별점 클릭 시
    if (type === 'readonly') return; // 읽기전용인 경우 아무것도 하지 않고 return

    const { offsetX } = e.nativeEvent as MouseEvent;
    const width = (e.currentTarget as HTMLImageElement).clientWidth;

    let newRating = index;
    if (offsetX < width / 2) {
      newRating += 0.5;
    } else {
      newRating += 1;
    }

    // 별 너비의 반보다 작은 부분 클릭하면 0.5 아니면 1 단위로 newRating 설정
    setSelectedRating(newRating); // selectedRating => 선택한 별점
    setRating(newRating); // zustand에 rating 업데이트
  };

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      percentage.push(1); // 꽉 찬 별
    } else if (i === fullStars && floatStars > 0) {
      percentage.push(floatStars); // 반 별 또는 소수만큼
    } else {
      percentage.push(0); // 빈 별
    }
  }

  return (
    <div className="flex justify-center items-center gap-2">
      {percentage.map((p, index) => (
        <div key={index} className={`${w} ${h} relative`}>
          <img
            src="/icon/emptyStar.svg"
            alt="별점"
            className={`${w} ${h} absolute ${type === 'select' && 'cursor-pointer'}`}
            onClick={(e) => handleClick(e, index)}
          />
          <div
            className={`${h} overflow-hidden absolute`}
            style={{
              width: `${Number(w.split('-')[1]) * 4 * p}px`,
            }}
          >
            <img
              src="/icon/fullStar.svg"
              alt="별점"
              className={`max-w-none max-h-none ${w} ${h} ${type === 'select' && 'cursor-pointer'}`}
              onClick={(e) => handleClick(e, index)}
            />
          </div>
        </div>
      ))}
      {type === 'select' && (
        <p className="text-text-secondary ml-2">{selectedRating !== 0 && selectedRating} / 5점</p>
      )}
    </div>
  );
}

export default ReviewRatings;
