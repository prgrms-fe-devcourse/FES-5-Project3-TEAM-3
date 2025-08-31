import Items from '@/component/search/Items';
import MainSearchBar from '@/component/MainPage/MainSearchBar';
import { useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import { filtered } from '@/hook/useFilter';

function SearchResult() {
  const [params] = useSearchParams();
  const keyword = params.get('keyword');
  const [match, setMatch] = useState<any[]>([]);

  useEffect(() => {
    if (keyword) {
      const target = filtered(keyword);
      setMatch(target);
    } else {
      setMatch([]);
    }
  }, [keyword]);

  return (
    <div className="h-screen w-249 mx-auto mt-8  items-center flex flex-col">
      <MainSearchBar />
      <div className="w-300 flex flex-col mt-10">
        <div className="w-full border-b">
          <p>{match.length} items</p>
        </div>
        <section className="mt-8 grid grid-cols-4 gap-8">
          {match.length > 0 ? (
            match.map(({ images, title, wine_description }) => (
              <Items image={images[0]} title={title} content={wine_description} />
            ))
          ) : (
            <>
              <p className="text-2xl text">검색결과가 없습니다</p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
export default SearchResult;
