function WineSellerCardSkeleton() {
  return (
    <div className="rounded-lg border border-secondary-500 bg-secondary-100 p-4 sm:p-5 flex flex-col gap-4 justify-center items-center min-w-[190px] max-w-[250px] shrink-0 animate-pulse">
      <div className="flex gap-4">
        {/* bottle image */}
        <div className="rounded-md overflow-hidden bg-transparent flex items-center justify-center">
          <div className="rounded-md bg-slate-400 h-32 w-full" />
        </div>
        {/* wine info section */}
        <div className="flex flex-col gap-3 justify-center items-center">
          <div className="h-4 w-24 bg-slate-400 rounded" />
          <div className="h-3 w-16 bg-slate-400 rounded" />
          <div className="h-3 w-12 bg-slate-400 rounded" />
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="size-4 bg-slate-400 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <hr className="border-secondary-500 w-full" />

      <ul className="flex flex-col gap-1">
        {['당도', '산미', '탄닌', '바디'].map((label) => (
          <li key={label} className="flex gap-4 items-center">
            <span className="w-8 h-3 bg-slate-400 rounded" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="size-4 bg-slate-400 rounded-full" />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default WineSellerCardSkeleton;
