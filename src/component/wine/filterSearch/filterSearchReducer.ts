import type { FilterKey } from './SearchBar';

type SelectedFilters = Record<FilterKey, string[]>;
type Action =
  | { type: 'toggle'; key: FilterKey; value: string }
  | { type: 'set'; key: FilterKey; values: string[] };

export const initialFilterState: SelectedFilters = {
  국가: [],
  품종: [],
  종류: [],
  도수: [],
  당도: [],
  산미: [],
  탄닌: [],
  바디: [],
};

export const filterSearchReducer = (state: SelectedFilters, action: Action): SelectedFilters => {
  switch (action.type) {
    case 'toggle':
      const current = state[action.key];
      return {
        ...state,
        [action.key]: current.includes(action.value)
          ? current.filter((v) => v !== action.value)
          : [...current, action.value],
      };
    case 'set':
      return {
        ...state,
        [action.key]: action.values,
      };

    default:
      return state;
  }
};
