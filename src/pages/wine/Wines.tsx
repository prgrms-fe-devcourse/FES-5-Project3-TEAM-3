import Pagination from '@/component/Pagination';
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
import { useAuth } from '@/store/@store';
import { useWineStore } from '@/store/wineStore';
import type { Json, Tables } from '@/supabase/database.types';
// import wines from '@/data/data.json';
import supabase from '@/supabase/supabase';
import { Suspense, useEffect, useState } from 'react';
import { Await, useLoaderData, useNavigationType, useSearchParams } from 'react-router';

export type WineInfoType = Tables<'wines'>;

export const getWines = async (from: number, to: number, appliedFilters?: Json) => {
  if (!appliedFilters) {
    appliedFilters = {};
  }
  const { data, error } = await supabase
    .rpc('filter_wines', {
      p_filters: appliedFilters,
    })
    .range(from, to);
  if (error) {
    console.error(error);
    return { wines: [], total_count: 0 };
  }

  const winesData = data.map((w) => w.wines);
  const totalCount = data?.[0]?.total_count ?? 0;
  console.log(winesData);
  console.log(totalCount);
  return { wines: winesData as WineInfoType[], total_count: totalCount as number };
};

export async function wineLoader() {
  return { wines: getWines(0, 8) };
}

function Wines() {
  const [searchParams, setSearchParams] = useSearchParams();

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

  const data = useLoaderData() as {
    wines: Promise<{ wines: WineInfoType[]; total_count: number }>;
  };

  const [winePromise, setWinePromise] = useState<
    Promise<{ wines: WineInfoType[]; total_count: number }>
  >(data.wines);

  const urlPage = Number(searchParams.get('page')) || 1;

  const [page, setPage] = useState(urlPage);
  const [totalPage, setTotalPage] = useState(10);
  const appliedFilters = useWineStore((s) => s.appliedFilters);
  const navType = useNavigationType(); // 뒤로가기/앞가기/새로고침 구분

  const user = useAuth();

  const resetFilters = useWineStore((s) => s.resetFilters);

  // useEffect(() => {
  //   setPage(Number(searchParams.get('page') || '1'));
  // }, [searchParams]);

  useEffect(() => {
    const wineCount = async () => {
      const { count, error } = await supabase
        .from('wines')
        .select('*', { count: 'exact', head: true });
      if (error) {
        console.log(error);
        return null;
      }
      if (count) {
        setTotalPage(Math.ceil(count / 9));
      }
    };
    wineCount();
  }, []);

  useEffect(() => {
    if (navType === 'POP') {
      const from = (Number(searchParams.get('page')) - 1) * 9;
      const to = Number(searchParams.get('page')) * 9 - 1;
      const w = getWines(from, to, appliedFilters);
      setWinePromise(w);
      w.then((w) => setTotalPage(Math.ceil(w.total_count / 9)));
    } else {
      // 필터가 바뀌거나 user가 바뀌면 페이지 1로 초기화
      setSearchParams({ ...Object.fromEntries(searchParams), page: '1' });
      setPage(1);
      const from = 0;
      const to = 8;
      const w = getWines(from, to, appliedFilters);
      setWinePromise(w);
      w.then((w) => setTotalPage(Math.ceil(w.total_count / 9)));
    }
    // 필터 적용해서 새 Promise 가져오기
  }, [appliedFilters, user, navType]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const winesDiv = document.getElementById('wines-container');
      if (winesDiv && !winesDiv.contains(e.target as Node)) {
        resetFilters();
        setSearchParams({ ...Object.fromEntries(searchParams), page: '1' });
        setPage(1);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const pageChange = (newPage: number) => {
    const from = (newPage - 1) * 9;
    const to = newPage * 9 - 1;
    setSearchParams({ ...Object.fromEntries(searchParams), page: String(newPage) });

    setPage(newPage);
    setWinePromise(getWines(from, to, appliedFilters));
  };

  return (
    <div
      id="wines-container"
      className="flex flex-col justify-baseline items-center min-h-[calc(100vh-12.125rem)]"
    >
      <SearchBar filterOptions={filterOptions} />
      <div className="w-full px-50 py-8 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 justify-center flex-grow">
        <Suspense fallback={<WinesSkeleton />}>
          <Await resolve={winePromise}>{(wines) => <WineList filteredWines={wines.wines} />}</Await>
        </Suspense>
      </div>
      <Pagination page={page} totalPages={totalPage} onPageChange={pageChange} siblingCount={2} />
    </div>
  );
}

export default Wines;
