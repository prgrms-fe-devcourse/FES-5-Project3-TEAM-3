import SearchBar from '@/component/wine/SearchBar';
import WinesSkeleton from '@/component/wine/skeleton/WineInfoSkeleton';
import WineInfo from '@/component/wine/wineInfo/WineInfo';
import wines from '@/data/data.json';
import { useEffect, useState } from 'react';

export type WineInfoType = (typeof wines)[number];

function Wines() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <SearchBar />
      <div className="w-full px-50 py-8 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 justify-center">
        {loading ? (
          <WinesSkeleton />
        ) : (
          wines.map((wine) => <WineInfo wineInfo={wine} key={wine.title} />)
        )}
      </div>
    </div>
  );
}

export default Wines;
