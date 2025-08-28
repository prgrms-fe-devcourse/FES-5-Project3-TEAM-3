import BoardComment from "./Comment";

function InputComment() {
  return (
    <div>
      <div className="flex gap-4">
        <label htmlFor="comment"></label>
        <input
          type="text"
          id="comment"
          placeholder="댓글을 작성하세요."
          className="h-6.5 w-188 px-6 py-4 rounded-2xl border-primary-500"
        />
        <button
          className="rounded-2xl px-2 py-1 bg-primary-500 drop-shadow-sm drop-shadow-[#6951ff]/5"
          type="submit"
          aria-label="댓글 등록버튼"
        >
          등록
        </button>
      </div>
      <BoardComment/>
    </div>
  );
}
export default InputComment