import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Pagination } from 'swiper/modules';
import UserCollection from './UserCollection';
import VerticalPagination from './MainPagination';

type Item = {
  id: number;
  src: string;
  icon: string;
  title: string;
  content: string;
  price: string;
};

export default function Collection({ collection }: { collection: Item[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null); 
  const swiperRef = useRef<SwiperType | null>(null); 

  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);

  const target = useRef(0);
  const current = useRef(0);
  const rafId = useRef<number | null>(null);

  const computeProgress = () => {
    const wrap = wrapperRef.current;
    if (!wrap) return 0;
    const rect = wrap.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = wrap.offsetHeight - vh;
    const passed = Math.min(Math.max(-rect.top, 0), total); 
    return total > 0 ? passed / total : 0; 
  };

  useEffect(() => {
    const EASE = 0.14; 

    const render = () => {
      const s = swiperRef.current;
      if (s) {
        current.current += (target.current - current.current) * EASE;
        if (typeof s.setProgress === 'function') {
          s.setProgress(current.current, 0);
        } else {
          const min = s.minTranslate();
          const max = s.maxTranslate();
          const t = min + (max - min) * current.current;
          s.setTranslate(t);
          s.updateSlidesClasses();
        }
        const total = collection.length;
        const clamped = Math.min(1, Math.max(0, current.current));
        const idx = total > 1 ? Math.round(clamped * (total - 1)) : 0;
        if (idx !== activeIdxRef.current) {
          activeIdxRef.current = idx;
          setActiveIdx(idx);
        }
      }
      
      rafId.current = requestAnimationFrame(render);
    };

    const onScroll = () => (target.current = computeProgress());
    const onResize = () => {
      const p = computeProgress();
      target.current = p;
      current.current = p; 
    };

    onResize();
    rafId.current = requestAnimationFrame(render);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);
  
  const total = collection.length
  const stickyDurationVH = total * 100;


  return (
    <section>
      <div ref={wrapperRef} className="relative" style={{ height: `calc(${stickyDurationVH}vh)` }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="relative w-full h-full">
            <VerticalPagination
              total={total}
              active={activeIdx}
              onSelect={(i) => {
                target.current = total > 1 ? i / (total - 1) : 0;
              }}
              side="right" 
              barWidth={40}
              barHeight={4}
              barActiveWidth={80}
              barActiveHeight={4}
              gapClassName="gap-12"
              className="mr-20" 
              dotClassName="bg-white/40 hover:bg-white/60 "
              activeDotClassName="bg-white"
              getLabel={(i) => `${i + 1} / ${total}`}
            
            />
            <img
              src="/image/subHeroImg.png"
              alt="유저의 와인셀러"
              className="absolute inset-0 w-full h-full object-cover -z-10"
            />

            <div className="absolute inset-0 z-10 grid grid-cols-2 gap-94 max-w-6xl mx-auto px-6 py-8">
              <div className="text-white flex flex-col mt-30 ">
                <h3 className="text-[108px] leading-none">User Collection</h3>
                <p className="mt-4">
                  Winepedia의 멤버들이 엄선한 와인들을 구경해보세요 <br /> 당신의 와인생활이 더
                  풍성해 질 수 있습니다
                </p>
              </div>

              <div className="h-full min-h-0 will-change-transform">
                <Swiper
                  direction="vertical"
                  slidesPerView={1}
                  spaceBetween={30}
                  allowTouchMove={false}
                  mousewheel={false}
                  pagination={{ clickable: true }}
                  modules={[Pagination]}
                  onSwiper={(sw) => (swiperRef.current = sw)}
                  className="h-full"
                >
                  {collection.map((item) => (
                    <SwiperSlide key={item.id} className="h-full">
                      <UserCollection {...item} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
