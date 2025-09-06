import Button from '@/component/Button';
import { countryInfo, grapes } from './filterInfo';
import { useState } from 'react';
import type { FilterKey } from './SearchBar';
import { useWineStore } from '@/store/wineStore';

interface FilterListProps {
  name: FilterKey;
  filter: string[];
  moreInfo?: string[];
}

function FilterList({ name, filter, moreInfo }: FilterListProps) {
  const [countryOpened, setCountryOpened] = useState(false);
  const selectedFilters = useWineStore((s) => s[name]);
  const setTempFilters = useWineStore((state) => state.setTempFilters);
  const toggleCountryOpened = () => {
    setCountryOpened(!countryOpened);
  };

  return (
    <div className={`flex gap-3 `}>
      <span className="py-1 whitespace-nowrap">{name}</span>
      <div className="flex flex-wrap gap-2 w-11/12 items-center ">
        {name === '국가' ? (
          <>
            {filter.map((filterName) => (
              <Button
                key={filterName}
                type="button"
                size="sm"
                color="secondary"
                hasIcon
                className={`"text-text-secondary bg-secondary-200/50"
                ${selectedFilters.includes(filterName) ? 'bg-secondary-400' : 'bg-secondary-200/50 '}`}
                onClick={() => setTempFilters(name, filterName)}
              >
                <img src={countryInfo[filterName].icon} alt={filterName} className="w-6 h-6" />
                {filterName}
              </Button>
            ))}
            <div className="border-y border-gray-300 flex gap-2 py-2 flex-wrap">
              {moreInfo && countryOpened
                ? moreInfo?.map((filterName) => (
                    <Button
                      key={filterName}
                      type="button"
                      size="sm"
                      color="secondary"
                      hasIcon
                      className={`"text-text-secondary bg-secondary-200/50"
                      ${selectedFilters.includes(filterName) ? 'bg-secondary-400' : 'bg-secondary-200/50 '}`}
                      onClick={() => setTempFilters(name, filterName)}
                    >
                      <img
                        src={countryInfo[filterName].icon}
                        alt={filterName}
                        className="w-6 h-6"
                      />
                      {filterName}
                    </Button>
                  ))
                : null}
            </div>
          </>
        ) : (
          filter.map((filterName) => (
            <Button
              key={filterName}
              type="button"
              size="sm"
              color="secondary"
              className={`"text-text-secondary bg-secondary-200/50"
              ${selectedFilters.includes(filterName) ? 'bg-secondary-400' : 'bg-secondary-200/50 '}`}
              onClick={() => setTempFilters(name, filterName)}
            >
              {name === '품종' ? `${grapes[filterName].ko} (${filterName})` : filterName}
            </Button>
          ))
        )}
        {name === '당도' && (
          <div className="group flex items-center gap-2">
            <img src="/icon/info.svg" alt="당도정보" className="w-6 h-6 shrink-0" />
            <p className="text-text-secondary hidden group-hover:block px-3 py-1 bg-primary-300/20 rounded-full">
              와인에서 느껴지는 단맛의 정도 : dry(0) - sweet(5)
            </p>
          </div>
        )}
        {name === '산미' && (
          <div className="group flex items-start gap-2 shrink-0">
            <img src="/icon/info.svg" alt="당도정보" className="w-6 h-6 shrink-0" />
            <p className="text-text-secondary hidden group-hover:block px-3 py-1 bg-primary-300/20 rounded-full">
              상큼하고 신선한 느낌을 주는 신맛의 정도 : 산도가 높을수록 상쾌하고 입맛을 돋움
            </p>
          </div>
        )}
        {name === '탄닌' && (
          <div className="group flex items-center gap-2">
            <img src="/icon/info.svg" alt="당도정보" className="w-6 h-6 shrink-0" />
            <p className="text-text-secondary hidden group-hover:block px-3 py-1 bg-primary-300/20 rounded-full">
              포도껍질/씨/줄기에서 나오는 성분 : 입안을 살짝 떫고 건조하게 만드는 느낌을 주며 와인의
              구조감 형성
            </p>
          </div>
        )}
        {name === '바디' && (
          <div className="group flex items-center gap-2">
            <img src="/icon/info.svg" alt="당도정보" className="w-6 h-6 shrink-0" />
            <p className="text-text-secondary hidden group-hover:block px-3 py-1 bg-primary-300/20 rounded-full ">
              와인의 무게감과 풍부함 의미 : 라이트바디(0) - 풀바디(5)
            </p>
          </div>
        )}
      </div>
      {moreInfo ? (
        <Button
          type="button"
          size="sm"
          color="secondary"
          className="bg-secondary-200/50 justify-self-end"
          onClick={toggleCountryOpened}
          hasIcon
        >
          <img src="icon/add.svg" alt="국가 필터 더보기" className="w-4 h-4" />
          더보기
        </Button>
      ) : null}
    </div>
  );
}

export default FilterList;
