import { useAuth } from '@/store/@store';

export function useIsMine(writerId: string) {
  const { userId } = useAuth();
  return !!userId && !!writerId && userId === writerId;
}
