import type { Tables } from '@/supabase/database.types';

function WineTag({ tag }: { tag: Tables<'hashtag_counts'> }) {
  return (
    <div className="rounded-full bg-gray-300 px-3 py-1 text-text-secondary"># {tag.tag_text}</div>
  );
}

export default WineTag;
