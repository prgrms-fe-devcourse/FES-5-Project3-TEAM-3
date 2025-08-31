import MainSearchBar from "@/component/MainPage/MainSearchBar"

function SearchResult() {
  return (
    <div className="w-249 mx-auto mt-8  items-center flex flex-col">
      <MainSearchBar /> 
      <div className="w-300 flex mt-10">
        <div className="w-full border-b">
          <p>4 items</p>
        </div>
        <section>
          {/* 여기에 뭘 내보내지? */}
        </section>
      </div>   
  </div>
  );
}
export default SearchResult



