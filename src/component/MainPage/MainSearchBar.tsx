import useToast from '@/hook/useToast';

import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';

interface Props {
  setReseach?: React.Dispatch<React.SetStateAction<string[]>>;
}

function MainSearchBar({ setReseach }: Props) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const searchBarRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const k = keyword.toLowerCase().trim();
    if (searchBarRef.current) {
      searchBarRef.current.value = '';
    }

    if (k.length <= 0) {
      useToast('error', '검색어를 입력하세요');
      return;
    }
    setReseach?.((prev) => {
      const next = [k, ...prev.filter((x: string) => x !== k)].slice(0, 5);
      localStorage.setItem('recently-search', JSON.stringify(next));
      return next;
    });

    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  const handleFocus = (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
    if ((e.target as Element).closest('label')) return;
    searchBarRef.current?.focus();
  };

  return (
    <form
      className="flex items-center justify-center border-1 border-[#8e95a9] w-full px-6 py-2 rounded-full gap-89.5 cursor-text"
      onSubmit={(e) => handleSubmit(e)}
      onClick={(e) => handleFocus(e)}
    >
      <input
        className="w-full  outline-none 
              flex justify-center
             focus:placeholder:opacity-0"
        ref={searchBarRef}
        type="text"
        id="search"
        value={keyword}
        autoComplete="off"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="검색어를 입력하세요."
      />
      <label htmlFor="search">
        <button className="pt-1 cursor-pointer" type="submit">
          <img src="/icon/search-btn.svg" alt="검색아이콘" />
        </button>
      </label>
    </form>
  );
}
export default MainSearchBar;
