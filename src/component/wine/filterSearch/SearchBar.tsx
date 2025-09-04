import FilterList from './FilterList';
import Button from '@/component/Button';
import { useWineStore } from '@/store/wineStore';
import { useMemo, useState } from 'react';

interface FilterOptionsType {
  filterOptions: Record<FilterKey, string[]>;
}
export type FilterKey = '국가' | '품종' | '종류' | '도수' | '당도' | '산미' | '탄닌' | '바디';

function SearchBar({ filterOptions }: FilterOptionsType) {
  // useState로 필터버튼 누르는 값 가지고있기
  // 겁색버튼 누르면 최종으로 클릭된 필터 버튼 값 -> zustand+URLQuery로 관리하기
  const primary = ['국가', '품종', '종류'] as const;
  const [openAdditionalOpt, setOpenAdditionalOpt] = useState(false);
  const setAppliedFilters = useWineStore((state) => state.setAppliedFilters);
  const resetTempFilters = useWineStore((s) => s.resetTempFilters);

  const toggleAdditionalOpt = () => {
    setOpenAdditionalOpt((prev) => !prev);
  };

  const primaryCountry = useMemo(() => filterOptions['국가'].slice(0, 10), [filterOptions]);
  const additionalCountry = useMemo(() => filterOptions['국가'].slice(10), [filterOptions]);

  return (
    <div className="flex flex-col px-50 py-3 pb-0 w-full h-auto gap-3 relative">
      <Button
        type="button"
        size="sm"
        className="absolute bottom-24 right-52"
        onClick={resetTempFilters}
      >
        초기화
      </Button>
      {openAdditionalOpt
        ? Object.entries(filterOptions).map(([key, value]) => {
            const k = key as FilterKey;
            if (key === '국가')
              return (
                <FilterList key={k} name={k} filter={primaryCountry} moreInfo={additionalCountry} />
              );
            return <FilterList key={key} name={k} filter={value} />;
          })
        : primary.map((key) => {
            if (key === '국가')
              return (
                <FilterList
                  key={key}
                  name={key}
                  filter={primaryCountry}
                  moreInfo={additionalCountry}
                />
              );
            return <FilterList key={key} name={key} filter={filterOptions[key]} />;
          })}
      <div
        className="flex justify-center items-center bg-gray-200 hover:bg-gray-300 cursor-pointer py-1 rounded-lg"
        onClick={toggleAdditionalOpt}
      >
        옵션전체보기 {openAdditionalOpt ? '▴' : '▾'}
      </div>

      <Button fullWidth onClick={setAppliedFilters}>
        필터적용하기
      </Button>
    </div>
  );
}

export default SearchBar;
