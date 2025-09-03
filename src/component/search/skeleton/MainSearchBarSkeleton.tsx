function SearchBarSkeleton() {
  return (
    <div
      className="flex items-center justify-center border-1 border-[#8e95a9] w-full px-6 py-2 rounded-full gap-4"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      {/* 입력창 자리 */}
      <div className="flex-1 h-6 bg-gray-200 rounded animate-pulse" />

      {/* 버튼 자리 */}
      <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
    </div>
  );
}

export default SearchBarSkeleton;
