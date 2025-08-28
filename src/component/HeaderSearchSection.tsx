import { useEffect, useRef, useState } from 'react';
import Categories from './MainPage/Categories';
import gsap from 'gsap'

type Props = {
  searchBar: boolean;
};

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

function HeaderSearchSection({ searchBar }: Props) {

  const sectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!sectionRef.current) return;
      if (searchBar) {
        // 열릴 때
        gsap.to(sectionRef.current, {
          height: sectionRef.current.scrollHeight,
          duration: 0.5,
          ease: 'power2.out',
        });
      } else {
        // 닫힐 때
        gsap.to(sectionRef.current, {
          height: 0,
          duration: 0.5,
          ease: 'power2.in',
        });
      }
    }, [searchBar]);


  const parseArray = (s: string | null): string[] => {
    if (!s) return [];
    try {
      const value = JSON.parse(s);
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  };

  const searchBarRef = useRef<HTMLInputElement | null>(null);
  const [keyword, setKeyword] = useState('');
  const [recentSearch, setRecentSearch] = useState<string[]>(()=> parseArray(localStorage.getItem('recntly-search'))
  );

  const handleFocus = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ((e.target as Element).closest('label')) return;
    searchBarRef.current?.focus();
  };

  useEffect(() => {
    setRecentSearch(parseArray(localStorage.getItem('recently-search')));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const k = keyword.toLowerCase().trim();

    if (searchBarRef.current) {
      searchBarRef.current.value = '';
    }

    if (k.length <= 0) {
      alert('검색어를 입력하세요');
      return;
    }

    setRecentSearch((prev) => {
      const next = [k, ...prev.filter((x: string) => x !== k)].slice(0, 5);
      localStorage.setItem('recently-search', JSON.stringify(next));
      return next;
    });
  };

  return (
    <div
      className="fixed top-17.5 flex justify-center left-0 w-full bg-background-base overflow-hidden"
      ref={sectionRef}
    >
      <div className="h-124 flex flex-col mx-auto mt-8 gap-7">
        <form
          className="flex items-center justify-center border-1 border-[#8e95a9] w-249 px-6 py-2 rounded-full gap-89.5 cursor-tex"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="flex items-center justify-between w-full" onClick={(e) => handleFocus(e)}>
            <input
              className="w-full flex justify-center outline-none text-center focus:placeholder:opacity-0"
              ref={searchBarRef}
              type="text"
              id="search"
              autoComplete="off"
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="검색어를 입력하세요."
            />
            <label htmlFor="search">
              <button className="pt-1 cursor-pointer" type="submit">
                <img src="/icon/search-btn.svg" alt="검색아이콘" />
              </button>
            </label>
          </div>
        </form>
        <div className="flex flex-col gap-7 items-start">
          <div className="flex flex-col flex-wrap gap-4">
            <h2>#최근 검색어</h2>
            <div className="flex gap-4">
              {recentSearch.map((keyword: string, i) => (
                <div className="bg-secondary-400 rounded-md px-2 py-1" key={i}>
                  <p className="text-secondary-700">{keyword}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2>#추천 태그</h2>
          </div>
          <div className="flex flex-col">
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
export default HeaderSearchSection;
