import Items from '@/component/search/Items';
import MainSearchBar from '@/component/MainPage/MainSearchBar';
import { useSearchParams } from 'react-router';
import { filtered } from '@/hook/useFilter';
import { useState } from 'react';
import Pagination from '@/component/Pagination';

function SearchResult() {
  const [params] = useSearchParams();
  const keyword = params.get('keyword');
  const filterWine = filtered(keyword ?? '');
  const [page, _setPage] = useState(1);

  return (
    <div className="min-h-screen w-249 mx-auto mt-8  items-center flex flex-col flex-1">
      <MainSearchBar />
      <div className="w-300 flex flex-col mt-10">
        <div className="w-full border-b">
          <p>{filterWine.length} items</p>
        </div>
        <div className="flex flex-col gap-10">
          <section className="mt-8 grid grid-cols-4 gap-8">
            {filterWine.length > 0 ? (
              filterWine.map((item) => (
                <Items
                  key={item.wine_id}
                  image={item.image_url[0]}
                  title={item.name}
                  content={item.description_ko ?? ''}
                  wineId={item.wine_id}
                />
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center py-20">
                <p className="text-2xl ">검색결과가 없습니다</p>
              </div>
            )}
          </section>
          <Pagination page={page} totalPages={5} size="md" />
        </div>
      </div>
    </div>
  );
}
export default SearchResult;
