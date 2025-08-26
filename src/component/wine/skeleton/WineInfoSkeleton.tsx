function WineInfoSkeleton() {
  return (
    <div
      className="min-w-90 w-100 h-120 inline-flex flex-col gap-2 px-12 py-8 m-8 items-stretch mx-auto bg-gray-200 rounded-2xl"
      aria-busy="true"
    >
      <div className="flex justify-between items-center gap-8">
        {/* 이미지*/}
        <div className="w-15 h-60 bg-gray-100 rounded-md animate-pulse" />
        <div className="flex flex-col justify-between gap-3 flex-1">
          <div className="h-22 bg-gray-100 rounded w-4/5 animate-pulse mb-4" /> {/* 이름 */}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 bg-gray-100 rounded-full animate-pulse" /> {/* country icon */}
            <div className="h-4 bg-gray-100 rounded w-12 animate-pulse" /> {/* country text */}
            <div className="w-6 h-6 bg-gray-100 rounded-full animate-pulse" /> {/* alcohol icon */}
            <div className="h-4 bg-gray-100 rounded w-12 animate-pulse" /> {/* alcohol text */}
          </div>
          <div className="flex items-center gap-1.5 ">
            <div className="w-5 h-5 bg-gray-100 rounded-full animate-pulse" /> {/* grape icon */}
            <div className="h-4 bg-gray-100 rounded w-4/5 animate-pulse" /> {/* grape text */}
          </div>
          <div className="flex flex-col gap-3 mb-4">
            {/* TastingInfo */}
            <div className="h-4 bg-gray-100 rounded w-4/5 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-4/5 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-4/5 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-4/5 animate-pulse" />
          </div>
        </div>
      </div>

      {/* FlavorIcon*/}
      <div className="grid grid-rows-1 grid-cols-5 items-center justify-center gap-2 pt-2 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-12 h-12 bg-gray-100 rounded-full animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function WinesSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <WineInfoSkeleton key={i} />
      ))}
    </>
  );
}

export default WinesSkeleton;
