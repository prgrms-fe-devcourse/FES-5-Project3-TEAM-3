import { useEffect, useRef, useState } from 'react';
import { matchFlavor } from './matchFlavor';

function FlavorIcon({ flavor }: { flavor: string }) {
  const flavorCategory = matchFlavor(flavor);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  // 한 번만 체크하면 됨
  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsOverflow(el.scrollWidth > el.clientWidth);
    }
  }, []);

  return (
    <div className="w-13  flex flex-col overflow-hidden justify-center mx-auto font-normal">
      <img
        src={`icon/flavor/${flavorCategory}.svg`}
        alt={flavor}
        className="w-10 h-10 self-center"
        draggable="false"
      />
      <p
        ref={textRef}
        className={`text-sm text-text-secondary font-normal  whitespace-nowrap transform transition-transform duration-1000 ${
          isOverflow
            ? '-translate-x-0 group-hover:translate-x-[calc(48px_-_100%)] self-baseline'
            : 'text-center'
        }`}
      >
        {flavor}
      </p>
      {/* <p className="inline-block whitespace-break-spaces text-xs self-baseline">{flavor}</p> */}
    </div>
  );
}

export default FlavorIcon;
