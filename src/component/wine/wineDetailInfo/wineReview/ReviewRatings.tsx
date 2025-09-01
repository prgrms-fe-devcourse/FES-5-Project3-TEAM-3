function ReviewRatings({
  w = 'w-10',
  h = 'h-10',
  rating = 3.5,
}: {
  w?: string;
  h?: string;
  rating?: number;
}) {
  const fullStars = Math.floor(rating);
  const floatStars = Number((rating % 1).toFixed(1));
  const percentage: number[] = [];

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      percentage.push(1); // 꽉 찬 별
    } else if (i === fullStars && floatStars > 0) {
      percentage.push(floatStars); // 반 별 또는 소수만큼
    } else {
      percentage.push(0); // 빈 별
    }
  }

  console.log(percentage);

  return (
    <div className="flex justify-center items-center gap-2">
      {percentage.map((p, index) => (
        <div key={index} className={`${w} ${h} relative`}>
          <img src="/icon/emptyStar.svg" alt="별점" className={`${w} ${h} absolute`} />
          <div
            className={`${h} overflow-hidden absolute`}
            style={{ width: `${Number(w.split('-')[1]) * 4 * p}px` }}
          >
            <img
              src="/icon/fullStar.svg"
              alt="별점"
              className={`max-w-none max-h-none ${w} ${h}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReviewRatings;
