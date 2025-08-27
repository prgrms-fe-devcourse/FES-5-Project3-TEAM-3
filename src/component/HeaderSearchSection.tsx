import { useRef, useState } from "react";
import Categories from "./Categories";

type Props = {
  searchBar: boolean
}

function HeaderSearchSection({ searchBar }: Props) {


  const [keyword, setKeword] = useState('')
  const [searchedKeyword,setSearchedKeyword] = useState<string[]>([])
  const wineCategories = [
    {
      src: '/icon/redWineIcon.png',
      alt: '레드와인',
      category: 'Red',
    },
    {
      src: '/icon/whitewineIcon.png',
      alt: '화이트와인',
      category: 'White',
    },
    {
      src: '/icon/roseWineIcon.png',
      alt: '로제와인',
      category: 'Rose',
    },
    {
      src: '/icon/champaignIcon.png',
      alt: '스파클링',
      category: 'Sparkling',
    },
    {
      src: '/icon/dessertWineIcon.png',
      alt: '디저트와인',
      category: 'Dissert',
    },
  ];

  const searchBarRef = useRef<HTMLInputElement| null>(null);
  const handleFocus = (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
    if((e.target as Element).closest('label')) return 
    searchBarRef.current?.focus()  
  };

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (!keyword.trim()) {
      alert('검색어를 입력해주세요');
      return;
    }
    setSearchedKeyword([...keyword])
  };

  return (
    <div
      className={
        searchBar
          ? 'fixed top-17.5 left-0 w-full max-h-124 flex bg-background-base overflow-hidden transition-[max-height] duration-300 justify-center'
          : 'fixed top-17.5 left-0 w-full max-h-0 flex  bg-secondary-50 overflow-hidden transition-[max-height] duration-300'
      }
    >
      <div className="h-124 flex flex-col mx-auto mt-8 gap-7">
        <div>
          <form
            className="flex items-center justify-end border-1 border-[#8e95a9] w-249 px-6 py-2 rounded-full gap-89.5 cursor-text"
            onClick={(e) => handleFocus(e)}
            onSubmit={(e) => handleSubmit(e)}
          >
            <input
              className="outline-none"
              ref={searchBarRef}
              type="text"
              id="search"
              onBlur={(e) => setKeword(e.target.value)}
              placeholder="검색어를 입력하세요."
            />
            <label htmlFor="search">
              <button
                onSubmit={(e) => handleSubmit(e)}
                className="pt-1 cursor-pointer"
                type="submit"
              >
                <img src="/icon/search-btn.svg" alt="검색아이콘" />
              </button>
            </label>
          </form>
        </div>
        <div className="flex flex-col gap-7 items-start">
          <div>
            <h2>#최근 검색어</h2>
            <div className="flex gap-4">
              {searchedKeyword.map((keyword) => (
                <div className=" border-black border-1">{keyword}</div>
              ))}
            </div>
          </div>
          <div>
            <h2>#추천 태그</h2>
          </div>
          <div className="flex flex-col ">
            <h2>#카테고리</h2>
            <div className="flex gap-4">
              {wineCategories.map(({ src, alt, category }) => (
                <Categories key={alt} src={src} alt={alt} category={category} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HeaderSearchSection