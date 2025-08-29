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
    <div className="flex gap-3">
      <span className="py-1 whitespace-nowrap">{name}</span>
      <div className="flex flex-wrap gap-2 w-11/12 ">
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
