import { Link } from 'react-router';

function AddNewCard() {
  return (
    <Link
      to={'/wines'}
      className="rounded-lg border border-secondary-500 bg-secondary-100 p-4 sm:p-5 shadow-sm flex flex-col gap-4 justify-center items-center max-w-[250px] shrink-0 cursor-pointer"
    >
      <div className="flex flex-col items-center justify-center text-text-secondary gap-2">
        <span className="text-3xl">+</span>
        <span className="text-sm font-medium">새로운 와인 기록 추가하기</span>
      </div>
    </Link>
  );
}
export default AddNewCard;
