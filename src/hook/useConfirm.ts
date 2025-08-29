import type { ConfirmOptions } from '@/@types/global';
import { useConfirmStore } from '@/store/@store';
import { useMemo } from 'react';

export function useConfirm() {
  return useMemo(() => {
    return (opts: ConfirmOptions) => useConfirmStore.getState().open(opts);
  }, []);
}
