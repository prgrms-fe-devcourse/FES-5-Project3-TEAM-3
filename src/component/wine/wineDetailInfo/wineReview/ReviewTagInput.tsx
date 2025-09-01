import Button from '@/component/Button';
import useToast from '@/hook/useToast';
import { useReviewStore } from '@/store/reviewStore';
import { useRef, useState, type FormEvent } from 'react';

function ReviewTagInput({
  type = '태그',
  category,
}: {
  type?: '태그' | '페어링';
  category?: string;
}) {
  const options: string[] = [];
  const [text, setText] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

  const addTag = useReviewStore((s) => s.addTag);
  const deleteTag = useReviewStore((s) => s.deleteTag);
  const tags = useReviewStore((s) => s.tag);
  const pairings = useReviewStore((s) => s.pairing);
  const addPairing = useReviewStore((s) => s.addPairing);
  const deletePairings = useReviewStore((s) => s.deletePairing);

  const inputRef = useRef<HTMLInputElement>(null);

  const addTagOption = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = inputRef.current?.value.trim();
    if (!value) {
      useToast('warn', '내용을 입력해주세요');
      return;
    }
    if (type === '태그') {
      if (tags.includes(value)) {
        useToast('warn', '이미 입력하신 태그입니다');
        setText('');
      } else if (value.length > 15) {
        useToast('warn', '태그는 15글자 내로 입력해주세요');
      } else if (tags.length >= 5) {
        useToast('warn', '태그는 최대 5개까지 입력할 수 있습니다');
        setText('');
      } else {
        addTag(value);
        setText('');
      }
      if (inputRef.current) inputRef.current.value = '';
      setFilteredOptions([]);
    } else {
      if (!category) useToast('warn', '카테고리를 설정해주세요');
      else if (pairings.some((p) => Object.keys(p)[0] === category && p[category] === value)) {
        useToast('warn', '이미 입력하신 태그입니다');
        setText('');
      } else if (value.length > 10) {
        useToast('warn', '페어링 이름은 10글자 내로 입력해주세요');
      } else if (pairings.length >= 5) {
        useToast('warn', '태그는 최대 5개까지 입력할 수 있습니다');
        setText('');
      } else {
        addPairing({ [category]: value });
        setText('');
      }
      if (inputRef.current) inputRef.current.value = '';
      setFilteredOptions([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);
    if (value === '') {
      setFilteredOptions([]);
    } else {
      const matches = options.filter((o) => o.trim().toLowerCase().includes(value.toLowerCase()));
      setFilteredOptions(matches);
    }
  };
  return (
    <>
      {type === '태그' && <p className="px-2 text-text-primary">태그</p>}
      <form className="flex justify-center items-center gap-2" onSubmit={addTagOption}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleChange}
          className="bg-white rounded-lg h-8 p-2"
          placeholder={`${type === '페어링' ? '페어링을' : '태그를'} 입력하세요`}
        />

        <Button size="sm">추가</Button>
      </form>
      <div className="flex gap-2 flex-wrap w-70 h-12 overflow-auto p-2">
        {type === '태그' &&
          tags.map((tag) => (
            <div
              key={tag}
              className="h-fit flex items-center rounded-full bg-gray-300 px-3 py-1 text-text-secondary gap-2 whitespace-nowrap"
              onClick={() => deleteTag(tag)}
            >
              {tag}
              <button type="button">
                <img src="/icon/close.svg" alt="태그삭제" className="w-3 h-3" />
              </button>
            </div>
          ))}
        {type === '페어링' &&
          pairings.map((pairing, index) => {
            const key = Object.keys(pairing)[0];
            const value = pairing[key];
            return (
              <div
                key={index}
                className="flex items-center rounded-full bg-gray-300 px-3 py-1 text-text-secondary gap-2 whitespace-nowrap"
                onClick={() => deletePairings(pairing)}
              >
                {key}/{value}
                <button type="button">
                  <img src="/icon/close.svg" alt="태그삭제" className="w-3 h-3" />
                </button>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default ReviewTagInput;
