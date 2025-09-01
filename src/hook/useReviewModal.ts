export interface ReviewState {
  rating: number | null;
  sweetness: number | null;
  acidic: number | null;
  tannic: number | null;
  body: number | null;
  onlyReview: boolean;
  content: string;
  tag: string[];
  pairing: Record<string, string>[];
}

export type ReviewAction =
  | { type: 'setRating'; payload: number }
  | { type: 'setSweetnessTaste'; payload: number }
  | { type: 'setAcidicTaste'; payload: number }
  | { type: 'setTannicTaste'; payload: number }
  | { type: 'setBodyTaste'; payload: number }
  | { type: 'toggleOnlyReview' }
  | { type: 'addTag'; payload: string }
  | { type: 'deleteTag'; payload: string }
  | { type: 'addPairing'; payload: Record<string, string> }
  | { type: 'deletePairing'; payload: Record<string, string> }
  | { type: 'setContent'; payload: string };

export const initialState: ReviewState = {
  rating: null,
  sweetness: null,
  acidic: null,
  tannic: null,
  body: null,
  onlyReview: false,
  content: '',
  tag: [],
  pairing: [],
};

export function reviewReducer(state: ReviewState, action: ReviewAction): ReviewState {
  switch (action.type) {
    case 'setRating':
      return { ...state, rating: action.payload };
    case 'setSweetnessTaste':
      return { ...state, sweetness: action.payload };
    case 'setAcidicTaste':
      return { ...state, acidic: action.payload };
    case 'setTannicTaste':
      return { ...state, tannic: action.payload };
    case 'setBodyTaste':
      return { ...state, body: action.payload };
    case 'toggleOnlyReview':
      return { ...state, onlyReview: !state.onlyReview };
    case 'addTag':
      return { ...state, tag: [...state.tag, action.payload] };
    case 'deleteTag':
      return { ...state, tag: state.tag.filter((t) => t !== action.payload) };
    case 'addPairing':
      return { ...state, pairing: [...state.pairing, action.payload] };
    case 'deletePairing':
      return { ...state, pairing: state.pairing.filter((p) => p !== action.payload) };
    case 'setContent':
      return { ...state, content: action.payload };

    default:
      return state;
  }
}
