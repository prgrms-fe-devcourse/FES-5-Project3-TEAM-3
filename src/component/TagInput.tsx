import Button from '@/component/Button';
import React from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onAdd: () => void;
  tags: string[];
  onRemove: (tag: string) => void;
  onClear?: () => void;
  max?: number;
  placeholder?: string;
};

export default function TagInput({
  value,
  onChange,
  onAdd,
  tags,
  onRemove,
  onClear,
  max = 5,
  placeholder = '추가 태그 입력 (최대 5개)',
}: Props) {
  const composingRef = React.useRef(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // IME(한글 등) 조합 중 Enter 무시 (Mac 중복 입력 방지)
    if (composingRef.current || (e.nativeEvent as any)?.isComposing) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      if (tags.length < max) onAdd();
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">태그</span>
        {onClear && tags.length > 0 && (
          <button
            type="button"
            className="text-xs text-gray-500 cursor-pointer"
            onClick={() => onClear()}
          >
            전체삭제
          </button>
        )}
      </div>

      <div className="mt-2 flex gap-2">
        <input
          type="text"
          placeholder={placeholder}
          className="rounded-xl border border-gray-200 bg-white/70 px-4 py-2.5 flex-1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => (composingRef.current = true)}
          onCompositionEnd={() => (composingRef.current = false)}
          aria-label="태그 입력"
        />

        <Button
          size="md"
          type="button"
          borderType="outline"
          onClick={() => tags.length < max && onAdd()}
          disabled={tags.length >= max}
        >
          추가
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {tags.length === 0 ? (
          <div className="text-sm text-gray-400">등록된 태그 없음</div>
        ) : (
          tags.map((t) => (
            <span
              key={t}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-400 text-sm text-primary-400 bg-white shadow-sm"
            >
              <span className="text-sm"># {t}</span>
              <button type="button" className="text-xs text-red-500" onClick={() => onRemove(t)}>
                ✕
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );
}
