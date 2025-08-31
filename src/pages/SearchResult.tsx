import Items from "@/component/Items";
import MainSearchBar from "@/component/MainPage/MainSearchBar"
import { useSearchParams } from "react-router";

function SearchResult() {

  const [params] = useSearchParams()
  const keyword = params.get('keyword')
  console.log(keyword)

  /* 
  1. 검색어에 걸리는걸 필터링해서 어디에 담아두고
  2. 그 어디에 담아둔걸르 내보내면되는데...
   */
  return (
    <div className="h-screen w-249 mx-auto mt-8  items-center flex flex-col">
      <MainSearchBar /> 
      <div className="w-300 flex flex-col mt-10">
        <div className="w-full border-b">
          <p>4 items</p>
        </div>
        <section className="mt-8">
          {/* 여기에 뭘 내보내지? */}
          <Items/>
        </section>
      </div>   
  </div>
  );
}
export default SearchResult



