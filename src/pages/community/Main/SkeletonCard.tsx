export default function SkeletonCard() {
  return (
    <article className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="w-full h-44 bg-gray-200 rounded-t-2xl animate-pulse" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
        </div>

        <div className="h-5 mb-2 rounded bg-gray-200 w-3/4 animate-pulse" />
        <div className="h-3 mb-3 rounded bg-gray-200 w-full animate-pulse" />

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
          </div>

          <div className="flex items-center gap-4">
            <div className="h-3 bg-gray-200 rounded w-8 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-8 animate-pulse" />
          </div>
        </div>
      </div>
    </article>
  );
}
