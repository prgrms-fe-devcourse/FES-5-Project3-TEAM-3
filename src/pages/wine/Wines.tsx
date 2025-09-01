import {
  alcohol,
  bodyTasteInfo,
  countryInfo,
  grapes,
  tasteInfo,
  type,
} from '@/component/wine/filterSearch/filterInfo';
import SearchBar from '@/component/wine/filterSearch/SearchBar';
import WinesSkeleton from '@/component/wine/skeleton/WineInfoSkeleton';
import WineList from '@/component/wine/wineInfo/WineList';
import type { Tables } from '@/supabase/database.types';
// import wines from '@/data/data.json';
import supabase from '@/supabase/supabase';
import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router';

export type WineInfoType = Tables<'wines'>;

export const getWines = async () => {
  const { data, error } = await supabase.from('wines').select();
  if (error) {
    console.error(error);
    return null;
  }
  return data;
};

export async function wineLoader() {
  return { wines: getWines() };
}

function Wines() {
  // 적용된 필터(zustand+URLQuery) -> SearchBar에서 검색버튼 누르면 업데이트되도록
  // 와인데이터 : json or supabase에서 가져오기
  // 필터데이터

  // Wines에서는 데이터(와인데이터, 필터데이터)만 관리
  // WineList에서 필터링+렌더링 관리

  // const [winesData] = useState(wines);
  // console.log(wines);
  const filterOptions = {
    국가: Object.keys(countryInfo),
    품종: Object.keys(grapes),
    종류: Object.keys(type),
    도수: Object.keys(alcohol),
    당도: Object.keys(tasteInfo),
    산미: Object.keys(tasteInfo),
    탄닌: Object.keys(tasteInfo),
    바디: Object.keys(bodyTasteInfo),
  };

  const data = useLoaderData() as { wines: Promise<WineInfoType[]> };

  return (
    <div className="flex flex-col justify-center items-center">
      <SearchBar filterOptions={filterOptions} />
      <div className="w-full px-50 py-8 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 justify-center">
        <Suspense fallback={<WinesSkeleton />}>
          <Await resolve={data.wines}>{(wines) => <WineList wines={wines} />}</Await>
        </Suspense>
      </div>
    </div>
  );
}

export default Wines;
