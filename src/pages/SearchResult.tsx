import MainSearchBar from "@/component/MainPage/MainSearchBar"

function SearchResult() {
  return (
    <div className="w-full mt-8">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4">
          <MainSearchBar />
          <p className="text-sm text-text-secondary">4 items</p>
          <hr />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <section>
          <h2>Top Searched</h2>
        </section>
      </div>
    </div>
  );
}
export default SearchResult



