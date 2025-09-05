import { Link } from 'react-router';

function ShowMoreBtn() {
  return (
    <>
      <Link
        to="/community"
        className="group relative rounded-full inline-flex size-20 flex-none items-center justify-center border-text-primary/60 w-20 h-20 border-[0.1px] 
        p-2 ml-8 cursor-pointer transition-all duration-200 translate-y-30"
      >
        <svg
          width="34"
          height="15"
          viewBox="0 0 34 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="absolute transition-all duration-200 opacity-100 translate-y-0 group-hover:opacity-0 group-hover:translate-y-1"
        >
          <path
            d="M1.65234 6.61133C1.10006 6.61133 0.652344 7.05904 0.652344 7.61133C0.652344 8.16361 1.10006 8.61133 1.65234 8.61133V7.61133V6.61133ZM33.5548 8.31843C33.9453 7.92791 33.9453 7.29475 33.5548 6.90422L27.1908 0.54026C26.8003 0.149736 26.1671 0.149736 25.7766 0.54026C25.3861 0.930785 25.3861 1.56395 25.7766 1.95447L31.4334 7.61133L25.7766 13.2682C25.3861 13.6587 25.3861 14.2919 25.7766 14.6824C26.1671 15.0729 26.8003 15.0729 27.1908 14.6824L33.5548 8.31843ZM1.65234 7.61133V8.61133H32.8477V7.61133V6.61133H1.65234V7.61133Z"
            fill="black"
          />
        </svg>
        <span className="transition-all duration-200 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 absolute">
          전체보기
        </span>
      </Link>
    </>
  );
}
export default ShowMoreBtn;
