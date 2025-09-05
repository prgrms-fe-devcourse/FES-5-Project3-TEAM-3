// components/AnimatedPostsRow.tsx
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: React.ReactNode;
};

export default function AnimatedPost({ children }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.post-card');

      if (!cards.length) return;

      cards.sort((a, b) => a.offsetLeft - b.offsetLeft);

      gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.12,
          clearProps: 'all',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'bottom 40%',
            once: true,
          },
        }
      );

      ScrollTrigger.refresh();
    }, wrapRef);

    return () => ctx.revert();
  }, [children]);

  return (
    <div ref={wrapRef} className="w-full flex flex-wrap justify-center gap-3 sm:gap-4 lg:mx-90 lg:w-310 lg:h-90">
      {children}
    </div>
  );
}
