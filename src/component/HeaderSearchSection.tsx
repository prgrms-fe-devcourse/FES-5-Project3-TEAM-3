import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Categories from './MainPage/Categories';
import gsap from 'gsap';
import MainSearchBar from './MainPage/MainSearchBar';
import { Link } from 'react-router';

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

 useLayoutEffect(() => {
      const el = sectionRef.current;
      if (!el) return;
      gsap.set(el, { display: 'none', height: 0, overflow: 'hidden' });
 }, []);

 useEffect(() => {
   const el = sectionRef.current;
   if (!el) return;

   gsap.killTweensOf(el);

   if (searchBar) {

     gsap.set(el, { display: 'flex', height: 'auto' });

     const target = el.offsetHeight;

     gsap.fromTo(
       el,
       { height: 0 },
       {
         height: target,
         duration: 0.5,
         ease: 'power2.out',
         onComplete: () => {
           gsap.set(el, { height: 'auto' });
         },
       }
     );
   } else {

     const current = el.offsetHeight;
     gsap.set(el, { height: current });
     gsap.to(el, {
       height: 0,
       duration: 0.5,
       ease: 'power2.in',
       onComplete: () => {
         gsap.set(el, { display: 'none' });
       },
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

  const [recentSearch, setRecentSearch] = useState<string[]>(() => parseArray(localStorage.getItem('recntly-search')));

  useEffect(() => {
    setRecentSearch(parseArray(localStorage.getItem('recently-search')));
  }, []);

// overlay는 서치바가 다 들어가고나서 끄고싶은데
  return (
    <>
      <div
        className="fixed top-17.5 flex justify-center left-0 w-full bg-background-base overflow-hidden"
        ref={sectionRef}
      >
        <div className="h-124 flex flex-col mx-auto mt-8 gap-7 w-249">
          <MainSearchBar setReseach={setRecentSearch} />
          {/* 검색 value를 어떻게 전달하지? */}
          <div className="flex flex-col gap-7 items-start">
            <div className="flex flex-col flex-wrap gap-4">
              <h2>#최근 검색어</h2>
              <div className="flex gap-4">
                {recentSearch.map((keyword: string, i) => (
                  <Link
                    to={`/search/${keyword}`}
                    className="bg-secondary-400 rounded-md px-2 py-1 cursor-pointer"
                    key={i}
                  >
                    <p className="text-secondary-700">{keyword}</p>
                  </Link>
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
    </>
  );
}
export default HeaderSearchSection;
