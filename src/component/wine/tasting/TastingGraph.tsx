import { initialState, reviewReducer } from '@/hook/useReviewModal';
import tw from '@/utils/tw';
import React from 'react';
import { useCallback, useMemo, useReducer, useState } from 'react';

interface TastingGraphProps {
  name: string;
  rating?: number | null;
  style: 'review' | 'info';
  type?: 'readonly' | 'select';
  className?: string;
}

function TastingGraph({
  name,
  rating = 0,
  style,
  type = 'readonly',
  className,
}: TastingGraphProps) {
  if (rating === null)
    return <p className="text-sm text-text-secondary">정보가 존재하지 않습니다</p>;
  const colors = useMemo(
    () =>
      style === 'info'
        ? ['bg-primary-100', 'bg-primary-200', 'bg-primary-300', 'bg-primary-500', 'bg-primary-800']
        : [
            'bg-secondary-300',
            'bg-secondary-400',
            'bg-secondary-500',
            'bg-secondary-600',
            'bg-secondary-700',
          ],
    [style]
  );
  const shape = useMemo(
    () => (style === 'info' ? 'w-5 h-3 rounded-lg' : 'w-4 h-4 rounded-full'),
    [style]
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [_state, dispatch] = useReducer(reviewReducer, initialState);

  const reviewSweetness = useCallback(
    (v: number) => dispatch({ type: 'setSweetnessTaste', payload: v }),
    []
  );
  const reviewAcidic = useCallback(
    (v: number) => dispatch({ type: 'setAcidicTaste', payload: v }),
    []
  );
  const reviewTannic = useCallback(
    (v: number) => dispatch({ type: 'setTannicTaste', payload: v }),
    []
  );
  const reviewBody = useCallback((v: number) => dispatch({ type: 'setBodyTaste', payload: v }), []);

  const reviewTaste = useCallback((v: number) => {
    switch (name) {
      case '당도':
        reviewSweetness(v);
        break;
      case '산미':
        reviewAcidic(v);
        break;
      case '탄닌':
        reviewTannic(v);
        break;
      case '바디':
        reviewBody(v);
        break;

      default:
        break;
    }
  }, []);

  return (
    <li className="flex gap-4 items-center">
      <span className="align-bottom text-nowrap">{name}</span>
      <div
        className="flex gap-3"
        onMouseLeave={() => {
          type === 'select' && setHovered(null);
        }}
      >
        {colors.map((color, index) => {
          const fillLevel = selected ?? hovered;
          const isFilled = type === 'select' ? index + 1 <= (fillLevel ?? 0) : index + 1 <= rating;
          return (
            <div
              key={index}
              className={tw(
                shape,
                className,
                isFilled ? color : 'border border-gray-300',
                type === 'select' && 'cursor-pointer'
              )}
              onMouseEnter={() => {
                type === 'select' && !selected && setHovered(index + 1);
              }}
              onClick={() => {
                type === 'select' && setSelected(index + 1);
                reviewTaste(index + 1);
              }}
            ></div>
          );
        })}
      </div>
    </li>
  );
}

export default React.memo(TastingGraph);
