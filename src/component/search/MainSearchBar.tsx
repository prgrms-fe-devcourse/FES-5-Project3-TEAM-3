
import useToast from '@/hook/useToast';
import { useSearchStore } from '@/store/searchStore';
import { useRef} from 'react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/shallow';



function MainSearchBar() {
  const { query, setQuery, addRecent } = useSearchStore(
    useShallow((s) => ({
      query: s.query,
      setQuery: s.setQuery,
      addRecent:s.addRecent
    }))
  )
  const navigate = useNavigate();
  const searchBarRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const k = query.trim().replace(/\s+/g, '').toLowerCase();
    if (searchBarRef.current) {
      searchBarRef.current.value = '';
    }

    if (k.length <= 0) {
      useToast('error', '검색어를 입력하세요');
      return;
    }
    addRecent(k)
    navigate(`/search?keyword=${encodeURIComponent(k)}`);
    setQuery('')
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
        value={query}
        autoComplete="off"
        onChange={(e) => setQuery(e.target.value)}
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
