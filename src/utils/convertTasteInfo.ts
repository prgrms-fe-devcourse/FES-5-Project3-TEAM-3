import type { WineInfoType } from '@/pages/wine/Wines';

export const computeTaste = (taste: WineInfoType['taste']) =>
  Object.fromEntries(
    Object.entries(taste).map(([k, v]) => {
      return v === null ? [k, null] : [k, Math.ceil(v * 0.05)];
    })
  ) as typeof taste;
