import type { WineInfoType } from '@/pages/wine/Wines';
import WineInfo from './WineInfo';
import { useWineStore } from '@/store/wineStore';
import { memo } from 'react';

interface WineListProps {
  wines: WineInfoType[];
}

function WineList({ wines }: WineListProps) {
  const appliedFilters = useWineStore((s) => s.appliedFilters);

  const filteredWines: WineInfoType[] = wines.filter((wine) => {
    const alcoholPercentage = wine.alcohol_content ? parseFloat(wine.alcohol_content) : null;
    console.log(appliedFilters.도수);

    const ranges = [
      [0, 20],
      [20, 40],
      [40, 60],
      [60, 80],
      [80, 100],
    ];

    const matchTaste = (value: number, filters: number[]) =>
      filters.length === 0 ||
      filters.some((f) => {
        const [min, max] = ranges[f - 1];
        return value >= min && (f === 5 ? value <= max : value < max);
      });

    return (
      (appliedFilters.국가.length === 0 || appliedFilters.국가.includes(wine.country)) &&
      (appliedFilters.품종.length === 0 ||
        wine.grapes.some((g) => appliedFilters.품종.some((f) => g.includes(f)))) &&
      (appliedFilters.도수.length === 0 ||
        appliedFilters.도수.some((f) => {
          if (alcoholPercentage !== null)
            return f.min === f.max
              ? alcoholPercentage === 0
              : f.max
                ? alcoholPercentage >= f.min && alcoholPercentage <= f.max
                : alcoholPercentage > f.min;
        })) &&
      (appliedFilters.종류.length === 0 || appliedFilters.종류.includes(wine.category)) &&
      matchTaste(wine.taste.sweetness ?? 1000, appliedFilters.당도) &&
      matchTaste(wine.taste.acidic ?? 1000, appliedFilters.산미) &&
      matchTaste(wine.taste.tannic ?? 1000, appliedFilters.탄닌) &&
      matchTaste(wine.taste.body ?? 1000, appliedFilters.바디)
    );
  });

  if (filteredWines.length === 0)
    return (
      <div className="col-span-full flex justify-center items-center text-gray-500">
        검색결과가 없습니다
      </div>
    );
  return (
    <>
      {filteredWines.map((wine) => (
        <WineInfo wineInfo={wine} key={wine.title} />
      ))}
    </>
  );
}

export default memo(WineList);
