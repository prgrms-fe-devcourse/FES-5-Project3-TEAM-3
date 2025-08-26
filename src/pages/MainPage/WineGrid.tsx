import { useState } from 'react';
import Button from '../../component/Button';

interface Props {
  src: string;
  alt: string;
  title: string;
  text: string;
}
function WineGrid({ src, alt, title, text }: Props) {
  const [hover, setHover] = useState(false);

  const handleMouseEnter = () => {
    setHover(true);
  };
  const handleMouseLeave = () => {
    setHover(false);
  };

  return (
    <>
      {hover ? (
        <div
          className="relative flex justify-center items-center group"
          onMouseLeave={handleMouseLeave}
        >
          <img className="rounded-0.5 blur-sm transition-all duration-300 " src={src} alt={alt} />
          <div
            aria-hidden
            className="bg-black/40 blur-sm rounded-lg inset-0 absolute pointer-events-none"
          ></div>
          <div className="flex flex-col items-center justify-center gap-6 absolute inset-0">
            <h4 className="text-2xl font-semibold text-background-base">{title}</h4>
            <p className="text-background-base">{text}</p>
            <div className="flex">
              <Button size="md" borderType="solid" color="primary">
                더보기
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="ease-in-out " onMouseEnter={handleMouseEnter}>
          <img className="rounded-0.5 transition-all duration-300" src={src} alt={alt} />
        </div>
      )}
    </>
  );
}
export default WineGrid;
