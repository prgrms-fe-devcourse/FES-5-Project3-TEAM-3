function SkeletonMainPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative">
        <div className="block w-screen h-screen bg-background-base animate-pulse" />
        <h2 className="absolute left-85.5 bottom-38 flex flex-col gap-4">
          <div className="w-100 h-20 bg-gray-400 rounded animate-pulse" />
          <div className="w-200 h-20 bg-gray-400 rounded animate-pulse" />
        </h2>
      </section>

      {/* Wine Grid Section */}
      <section className="bg-radial from-background-base from-60% to-secondary-300 to-100% flex justify-center">
        <div className="grid grid-rows-3 grid-cols-3 gap-5 py-34.75">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-70 h-90 bg-gray-300 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>

      {/* Collection Section */}
      <section>
        <div className="w-full h-[400px] bg-gray-300 rounded-xl animate-pulse" />
      </section>

      {/* Trending Posts Section */}
      <section className="h-200 mt-35 flex flex-col items-center">
        <h3 className="text-[108px]">
          <div className="w-[500px] h-[120px] bg-gray-400 rounded animate-pulse" />
        </h3>
        <div className="mt-13 flex items-center gap-6">
          <div className="rounded-2xl w-70 h-90 bg-gray-300 animate-pulse" />
          <div className="w-40 h-12 bg-gray-400 rounded-xl animate-pulse" />
        </div>
      </section>
    </main>
  );
}
export default SkeletonMainPage