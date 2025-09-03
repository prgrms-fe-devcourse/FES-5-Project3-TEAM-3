import Items from '@/component/search/Items';
import MainSearchBar from '@/component/MainPage/MainSearchBar';
import {  useSearchParams} from 'react-router';
import { filtered } from '@/hook/useFilter';
import {  useState } from 'react';
import Pagination from '@/component/Pagination';
import SkeletonItem from '@/component/search/skeleton/SkeletonItem';




function SearchResult() {
  const [params] = useSearchParams();
  const keyword = params.get('keyword');
  const filterWine = filtered(keyword ?? '');
  const [page, setPage] = useState(1);
  const cardPerPage = 16
  const maxPage = Math.ceil(filterWine.length / cardPerPage);
  const startIndex = (page - 1) * cardPerPage;
  const endIndex = (startIndex + cardPerPage)
  const pagenatedItem = filterWine.slice(startIndex, endIndex)



  
  return (
    <div className="min-h-screen w-249 mx-auto mt-8  items-center flex flex-col flex-1">
      <MainSearchBar />
      <div className="w-300 flex flex-col mt-10">
        <div className="w-full border-b">
          <p>{filterWine.length} items</p>
        </div>
        <div className="flex flex-col gap-10">
          <section className="mt-8 grid grid-cols-4 gap-8">
            {filterWine === null ? (
              pagenatedItem.map((a) => <SkeletonItem key={a.wine_id} />)
            ) : filterWine.length > 0 ? (
              pagenatedItem.map((item) => (
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
          <Pagination page={page} onPageChange={(p) => setPage(p)} totalPages={maxPage} size="md" />
        </div>
      </div>
    </div>
  );
}
export default SearchResult;

