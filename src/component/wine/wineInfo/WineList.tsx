import type { WineInfoType } from '@/pages/wine/Wines';
import WineInfo from './WineInfo';
import { useWineStore } from '@/store/wineStore';
import { memo } from 'react';
import { Link } from 'react-router';

interface WineListProps {
  wines: WineInfoType[];
}

function WineList({ wines }: WineListProps) {
  const appliedFilters = useWineStore((s) => s.appliedFilters);
  const filteredWines: WineInfoType[] = wines.filter((wine) => {
    const alcoholPercentage = wine.abv ? parseFloat(wine.abv) : null;

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
      (appliedFilters.국가.length === 0 ||
        (wine.country && appliedFilters.국가.includes(wine.country))) &&
      (appliedFilters.품종.length === 0 ||
        (wine.variety &&
          wine.variety.some((g) => appliedFilters.품종.some((f) => g.includes(f))))) &&
      (appliedFilters.도수.length === 0 ||
        appliedFilters.도수.some((f) => {
          if (alcoholPercentage !== null) {
            const zeroToFiveCheck =
              f.min === 0 && f.max === 5 ? alcoholPercentage > 0 && alcoholPercentage <= 5 : true;
            const check =
              f.min === f.max
                ? alcoholPercentage === 0
                : f.max
                  ? alcoholPercentage >= f.min && alcoholPercentage <= f.max
                  : alcoholPercentage > f.min;
            return check && zeroToFiveCheck;
          }
        })) &&
      (appliedFilters.종류.length === 0 ||
        (wine.category !== null && appliedFilters.종류.includes(wine.category))) &&
      matchTaste(wine.sweetness ?? 1000, appliedFilters.당도) &&
      matchTaste(wine.acidic ?? 1000, appliedFilters.산미) &&
      matchTaste(wine.tannic ?? 1000, appliedFilters.탄닌) &&
      matchTaste(wine.body ?? 1000, appliedFilters.바디)
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
        <Link key={wine.name} to={`/wines/detail/${wine.wine_id}`} className="group">
          <WineInfo wineInfo={wine} />
        </Link>
      ))}
    </>
  );
}

export default memo(WineList);
