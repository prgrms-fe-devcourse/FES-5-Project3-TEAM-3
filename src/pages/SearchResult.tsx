import Items from '@/component/search/Items';
import MainSearchBar from '@/component/MainPage/MainSearchBar';
import { useSearchParams } from 'react-router';
import { filtered } from '@/hook/useFilter';


function SearchResult() {
  const [params] = useSearchParams();
  const keyword = params.get('keyword');
  const filterWine = filtered(keyword ?? '')

  return (
    <div className="h-screen w-249 mx-auto mt-8  items-center flex flex-col">
      <MainSearchBar />
      <div className="w-300 flex flex-col mt-10">
        <div className="w-full border-b">
          <p>{filterWine.length} items</p>
        </div>
        <section className="mt-8 grid grid-cols-4 gap-8">
          {filterWine.length > 0 ? (
            filterWine.map((item) => (
              <Items image={item.image_url[0]} title={item.name} content={item.description_ko ?? ''} />
            ))
          ) : (
            <>
              <p className="text-2xl ">검색결과가 없습니다</p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
export default SearchResult;
