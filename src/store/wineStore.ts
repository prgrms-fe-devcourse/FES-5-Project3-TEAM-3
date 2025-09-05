import {
  alcohol,
  bodyTasteInfo,
  countryInfo,
  grapes,
  tasteInfo,
  type,
} from '@/component/wine/filterSearch/filterInfo';
import type { FilterKey } from '@/component/wine/filterSearch/SearchBar';
import { create } from 'zustand';

export type FilterState = {
  국가: string[];
  품종: string[];
  도수: string[]; // 논알콜 0, 0-5% 0<alchol<=5 ...
  종류: string[];
  당도: string[];
  산미: string[];
  탄닌: string[];
  바디: string[];
  appliedFilters: {
    국가: string[];
    품종: string[];
    도수: { min: number; max?: number }[];
    종류: string[];
    당도: number[];
    산미: number[];
    탄닌: number[];
    바디: number[];
  };
};

export type FilterAction = {
  setTempFilters: (key: FilterKey, value: string) => void;
  setAppliedFilters: () => void;
  resetFilters: () => void;
  resetTempFilters: () => void;
};

const initialState: FilterState = {
  국가: [],
  품종: [],
  도수: [],
  종류: [],
  당도: [],
  산미: [],
  탄닌: [],
  바디: [],
  appliedFilters: {
    국가: [],
    품종: [],
    도수: [],
    종류: [],
    당도: [],
    산미: [],
    탄닌: [],
    바디: [],
  },
};

export const useWineStore = create<FilterState & FilterAction>((set, get) => ({
  국가: [],
  품종: [],
  도수: [],
  종류: [],
  당도: [],
  산미: [],
  탄닌: [],
  바디: [],
  appliedFilters: {
    국가: [],
    품종: [],
    도수: [],
    종류: [],
    당도: [],
    산미: [],
    탄닌: [],
    바디: [],
  },
  setTempFilters(key, value) {
    set((state) => {
      const exist = state[key].includes(value);
      return {
        [key]: exist ? state[key].filter((c) => c !== value) : [...state[key], value],
      };
    });
  },
  resetFilters: () => set(initialState),
  resetTempFilters: () =>
    set({ 국가: [], 품종: [], 도수: [], 종류: [], 당도: [], 산미: [], 탄닌: [], 바디: [] }),

  setAppliedFilters: () => {
    const state = get();

    const convert = {
      국가: (arr: string[]) => arr.map((v) => countryInfo[v].en),
      품종: (arr: string[]) => arr.flatMap((v) => [v, ...(grapes[v]?.similar || [])]),
      도수: (arr: string[]) =>
        arr.map((v) => {
          const { min, max } = alcohol[v];
          return max !== undefined ? { min, max } : { min };
        }),
      종류: (arr: string[]) => arr.map((v) => type[v]),
      당도: (arr: string[]) => arr.flatMap((v) => tasteInfo[v].rating),
      산미: (arr: string[]) => arr.flatMap((v) => tasteInfo[v].rating),
      탄닌: (arr: string[]) => arr.flatMap((v) => tasteInfo[v].rating),
      바디: (arr: string[]) => arr.flatMap((v) => bodyTasteInfo[v].rating),
    };
    set({
      appliedFilters: {
        국가: convert.국가(state.국가),
        품종: convert.품종(state.품종),
        도수: convert.도수(state.도수),
        종류: convert.종류(state.종류),
        당도: convert.당도(state.당도),
        산미: convert.산미(state.산미),
        탄닌: convert.탄닌(state.탄닌),
        바디: convert.바디(state.바디),
      },
    });
  },
}));
