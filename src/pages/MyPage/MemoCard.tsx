import { memo } from 'react';
import Card from '../community/Main/Card';

export const MemoCard = memo(Card, (prev, next) => {
  const a = prev.post;
  const b = next.post;

  return (
    a?.post_id === b?.post_id &&
    a?.like_count === b?.like_count &&
    a?.reply_count === b?.reply_count &&
    a?.title === b?.title &&
    a?.thumbnail_image === b?.thumbnail_image &&
    a?.post_category === b?.post_category &&
    a?.profile?.nickname === b?.profile?.nickname &&
    a?.profile?.profile_image_url === b?.profile?.profile_image_url
  );
});
