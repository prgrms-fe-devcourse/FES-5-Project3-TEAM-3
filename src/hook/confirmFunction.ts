import { useConfirmStore } from '@/store/@store';
import type { ConfirmOptions } from '@/@types/global';

export function confirm(opts: ConfirmOptions) {
  return useConfirmStore.getState().open(opts);
}
