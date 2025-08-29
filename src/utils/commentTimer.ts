export function commentTime(dateString: string): string {
  const now = new Date(Date.now());
  const created = new Date(dateString);
  const diff = (now.getTime() - created.getTime()) / 1000;

  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(diff / 3600);
  const days = Math.floor(diff / 86400);
  const months = Math.floor(diff / 2592000);
  const years = Math.floor(diff / 31536000);

  switch (true) {
    case diff < 60:
      return '방금 전';
    case diff < 3600:
      return `${minutes}분 전`;
    case diff < 86400:
      return `${hours}시간 전`;
    case diff < 2592000:
      return `${days}일 전`;
    case diff < 31536000:
      return `${months}달 전`;
    default:
      return `${years}년 전`;
  }
}
