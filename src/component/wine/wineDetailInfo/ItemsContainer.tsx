import type { Tables } from '@/supabase/database.types';
import Parings from './Parings';
import WineTag from './WineTag';

type ItemsProps =
  | {
      type: 'pairings';
      items: Tables<'pairings'>[];
    }
  | {
      type: 'tags';
      items: Tables<'hashtag_counts'>[];
    };

function ItemsContainer({ items, type }: ItemsProps) {
  return (
    <>
      <p className="flex gap-2 text-xl whitespace-nowrap text-text-primary">
        {type === 'pairings' ? `추천페어링` : '인기태그'}
        {/* {type === 'pairings' && <img src="/icon/ranking.svg" alt="인기페어링" />} */}
      </p>
      <ul className="w-full lg:w-3/4 flex justify-center  gap-5 mb-10 px-5 group">
        {items.length < 5 ? (
          <p className="text-text-secondary text-lg">
            {`5개 이상의 ${type === 'pairings' ? '페어링이' : '태그가'} 등록되면 확인할 수 있습니다`}
          </p>
        ) : type === 'pairings' ? (
          items.map((item) => <Parings key={item.pairing_id} pairing={item} />)
        ) : (
          items.map((item) => <WineTag key={item.tag_text} tag={item} />)
        )}
      </ul>
    </>
  );
}

export default ItemsContainer;
