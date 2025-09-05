import type { WineInfoType } from '@/pages/wine/Wines';
import FlavorIcon from './FlavorIcon';
import WineBasicInfo from './WineBasicInfo';
import supabase from '@/supabase/supabase';
import { useAuth } from '@/store/@store';
import useToast from '@/hook/useToast';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

function WineInfo({ wineInfo }: { wineInfo: WineInfoType }) {
  const { name, image_url, representative_flavor_ko, representative_flavor, wine_id } = wineInfo;
  const userId = useAuth().userId;
  const [wish, setWish] = useState(false);

  useEffect(() => {
    const isWish = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from('wishlists')
        .select('bookmark')
        .eq('user_id', userId)
        .eq('wine_id', wine_id);
      if (error) console.error(error);
      if (data && data.length !== 0) {
        setWish(data[0].bookmark);
      }
    };
    isWish();
  }, [userId, wine_id]);

  const toggleWish = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      useToast('error', '위시리스트를 추가하려면 로그인하세요');
      return;
    }
    const { data, error } = await supabase
      .from('wishlists')
      .upsert({ user_id: userId, wine_id, bookmark: !wish }, { onConflict: 'user_id,wine_id' })
      .select();
    if (error) console.error(error);
    if (data) {
      setWish(data[0].bookmark);
    }
  };

  return (
    <Link key={name} to={`/wines/detail/${wine_id}`} className="group">
      <div className="relative min-w-90 w-100 h-120 flex flex-col gap-2 px-12 py-8 m-8 items-stretch justify-between mx-auto rounded-xl bg-secondary-50 shadow-sm group-hover:shadow-2xl group-hover:bg-secondary-100 transition-transform duration-300 select-none">
        {/*전체카드 >  와인정보 + 향미료*/}
        <button type="button" onClick={toggleWish}>
          <img
            src={wish ? `/icon/bookmarkFilled.svg` : `/icon/bookmark.svg`}
            alt="위시리스트"
            className="w-6 h-6 absolute top-4 right-4"
          />
        </button>
        <div className="h-full flex justify-between items-center gap-8">
          {/*와인정보 >  이미지 + 정보*/}
          <img
            src={image_url.length !== 0 ? (image_url[1] ?? image_url[0]) : '/image/wineImage.svg'}
            alt={name}
            className="w-15"
            draggable="false"
          />
          <WineBasicInfo wineBasicInfo={wineInfo} />
        </div>
        <div className="grid grid-rows-1 grid-cols-5 items-center justify-center group pt-2 mb-2">
          {representative_flavor_ko && representative_flavor ? (
            representative_flavor_ko.map((s, i) => (
              <FlavorIcon flavor={s} flavoren={representative_flavor[i]} key={s} />
            ))
          ) : (
            <p className="col-span-full text-center">정보가 없습니다</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default WineInfo;
