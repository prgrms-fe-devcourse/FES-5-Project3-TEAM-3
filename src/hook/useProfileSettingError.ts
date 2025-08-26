import { ErrorMessages, type ErrorCode } from '@/component/MyPage/settingErrorCodes';
import { useCallback, useReducer } from 'react';

type Field = 'avatar' | 'nickname' | 'phone' | 'bio' | 'form';
type FieldErrors = Partial<Record<Field, ErrorCode>>;

type SectionBusy = {
  image: boolean;
  info: boolean;
  bio: boolean;
};

type State = {
  errors: FieldErrors;
  busy: SectionBusy;
};

type Action =
  | { type: 'SET_FIELD_ERROR'; field: Field; code: ErrorCode }
  | { type: 'CLEAR_FIELD_ERROR'; field: Field }
  | { type: 'CLEAR_ALL_ERRORS' }
  | { type: 'SET_BUSY'; section: keyof SectionBusy; value: boolean };

const initialState: State = {
  errors: {},
  busy: { image: false, info: false, bio: false },
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_FIELD_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: action.code } };
    case 'CLEAR_FIELD_ERROR': {
      const { [action.field]: _, ...rest } = state.errors;
      return { ...state, errors: rest };
    }
    case 'CLEAR_ALL_ERRORS':
      return { ...state, errors: {} };
    case 'SET_BUSY':
      return { ...state, busy: { ...state.busy, [action.section]: action.value } };
    default:
      return state;
  }
}

export function useProfileSettingError() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setError = useCallback((field: Field, code: ErrorCode) => {
    dispatch({ type: 'SET_FIELD_ERROR', field, code });
  }, []);

  const clearError = useCallback((field: Field) => {
    dispatch({ type: 'CLEAR_FIELD_ERROR', field });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_ERRORS' });
  }, []);

  const setBusy = useCallback((section: keyof SectionBusy, value: boolean) => {
    dispatch({ type: 'SET_BUSY', section, value });
  }, []);

  const getMessage = useCallback(
    (field: Field) => {
      const code = state.errors[field];
      return code ? ErrorMessages[code] : undefined;
    },
    [state.errors]
  );

  return {
    errors: state.errors,
    busy: state.busy,
    setError,
    clearError,
    clearAll,
    setBusy,
    getMessage,
  };
}
