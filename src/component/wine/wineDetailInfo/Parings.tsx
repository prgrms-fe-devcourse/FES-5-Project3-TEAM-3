import type { Tables } from '@/supabase/database.types';
import { useEffect, useRef, useState } from 'react';

function Parings({ pairing }: { pairing: Tables<'pairings'> }) {
  const { pairing_category, pairing_name } = pairing;
  const category = pairing_category ?? 'others';
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  // 한 번만 체크하면 됨
  useEffect(() => {
    const el = textRef.current;
    if (el) {
      console.log(el.scrollWidth, el.clientWidth);
      setIsOverflow(el.scrollWidth > el.clientWidth);
    }
  }, []);

  return (
    <div className="w-fit max-h-45 h-fit max-w-1/4 flex flex-col items-center px-5 lg:px-10 py-2 gap-2 rounded-xl border border-gray-400">
      <img
        src={`/image/pairing/${category}.png`}
        alt={category}
        className="x-25 min-w-25 h-25 min-h-25 rounded-full"
      />
      <div className="w-35 overflow-hidden">
        <p
          ref={textRef}
          className={`whitespace-nowrap transform transition-transform duration-1000 ${
            isOverflow
              ? 'translate-x-0 group-hover:translate-x-[calc(80px_-_100%)] text-start'
              : 'text-center'
          }`}
        >
          {pairing_name}
        </p>
      </div>
    </div>
  );
}

export default Parings;
