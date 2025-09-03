function SkeletonItem() {
  return (
    <div className="w-74 h-88 flex flex-col bg-white p-4 gap-4 rounded-lg shadow-md">
      <div className="min-w-34 h-50 bg-gray-200 animate-pulse rounded-lg" />
      <div className="flex flex-col justify-center gap-2">
        <div className="h-5 w-3/4 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded" />
      </div>
    </div>
  );
}

export default SkeletonItem;
