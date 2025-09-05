import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Categories from '../MainPage/Categories';
import gsap from 'gsap';
import MainSearchBar from './MainSearchBar';
import { Link } from 'react-router';
import { wineCategories } from '@/assets/staticArr';
import { useHashCount } from '@/hook/fetch';
import type { Tables } from '@/supabase/database.types';
import { useSearchStore } from '@/store/searchStore';
import { useShallow } from 'zustand/shallow';

type Props = {
  setOverlay: React.Dispatch<React.SetStateAction<boolean>>;
};
type HashCount = Tables<'hashtag_counts'>;

function HeaderSearchSection({ setOverlay }: Props) {
  const { isOpen, recent } = useSearchStore(
    useShallow((s) => ({
      isOpen: s.isOpen,
      recent: s.recent,
    }))
  );
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [hashTags, setHashTags] = useState<HashCount[]>([]);
  const item = Array.isArray(recent) ? recent : [];

  useEffect(() => {
    (async () => {
      const hash = await useHashCount();
      setHashTags(hash ?? []);
    })();
  }, []);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    gsap.set(el, { display: 'none', height: 0, overflow: 'hidden' });
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    gsap.killTweensOf(el);

    if (isOpen) {
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
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(el, { display: 'none' });
          setOverlay(false);
        },
      });
    }
  }, [isOpen]);

  return (
    <>
      <div
        className="fixed top-17.5 flex justify-center left-0 w-full bg-background-base overflow-hidden"
        ref={sectionRef}
      >
        <div className="h-124 flex flex-col mx-auto mt-8 gap-7 w-249">
          <MainSearchBar />
          <div className="flex flex-col gap-7 items-start">
            <div className="flex flex-col flex-wrap gap-4">
              <h2>#최근 검색어</h2>
              <div className="flex gap-4">
                {item.map((keyword: string, i) => {
                  const k = keyword.trim().replace(/\s+/g, '').toLowerCase();

                  return (
                    <Link
                      to={`/search?keyword=${encodeURIComponent(k)}`}
                      className="bg-secondary-400 rounded-md px-2 py-1 cursor-pointer"
                      key={i}
                    >
                      <p className="text-secondary-700">{k}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col flex-wrap gap-4">
              <h2>#추천 태그</h2>
              <div className="flex gap-4">
                {hashTags.map((tags, i) => (
                  <Link
                    to={`/search?keyword=${encodeURIComponent(tags.tag_text ?? '')}`}
                    className="bg-secondary-400 rounded-md px-2 py-1 cursor-pointer"
                    key={i}
                  >
                    <p className="text-secondary-700">{tags.tag_text}</p>
                  </Link>
                ))}
              </div>
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
