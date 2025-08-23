function MainPage() {

  const wines = [
    {
      src: '/image/CS.png',
      alt: '카베르네소비뇽',
    },
    {
      src: '/image/FranceWine.png',
      alt: '프랑스와인',
    },
    {
      src: '/image/melot.png',
      alt: '멜론',
    },
    {
      src: '/image/italyWine.png',
      alt: '이탈리아와인',
    },
    {
      src: '/image/pinotNoir.png',
      alt: '피노누아',
    },
    {
      src: '/image/spainWine.png',
      alt: '스페인 와인',
    },

    {
      src: '/image/chardonay.png',
      alt: '샤도네이',
    },
    {
      src: '/image/usaWine.png',
      alt: '미국와인',
    },
    {
      src: '/image/shauvignonBlanc.png',
      alt: '소비뇽 블랑',
    },
  ];

  return (
    <main>
      <section className="relative">
        <img className="block" src="/image/HeroImg.png" alt="메인이미지" />
        <h2 className="absolute bottom-38 left-12 text-primary-100 text-[108px]">
          WinePedia
          <br />
          Explore, Taste, Enjoy
        </h2>
      </section>
      <section className="bg-radial from-background-base from-60% to-secondary-300/40 to-100% flex justify-center">
        <div className="grid grid-row-3 grid-cols-3 gap-5 py-34.75">
          {wines.map(({ src, alt }) => (
            <img className="rounded-0.5" src={src} alt={alt} />
          ))}
        </div>
      </section>
      <section>
        <div className="relative">
          <img
        
            src="/image/subHeroImg.png"
            alt="유저의 와인셀러"
          />
          <div className="absolute top-36.75 left-47.75">
            <h3 className="text-[108px] text-background-base">User Collection</h3>
            <p className="text-background-base">
              Winepedia의 멤버들이 엄선한 와인들을 구경해보세요. <br /> 당신의 와인 생활이 더 풍성해
              질 수 있습니다
            </p>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-center items-center bg-primary-50 h-158 w-121.5 rounded-2xl absolute right-0 top-0">
              <div className="border-secondary-300 border-3 h-145 w-111 rounded-2xl "></div>
            </div>
          </div>
        </div>
      </section>
      <section className="h-screen mt-10 flex flex-col items-center">
        <h3 className="text-[108px]">Trending Posts</h3>
        <div className="mt-20 flex items-center">
          <div className="rounded-2xl w-70 h-90 bg-gray-600"></div>
          <button className='rounded-full border-1 w-20 h-20 ml-17 cursor-pointer   'type="button">전체보기</button>
        </div>
        <div className="relative">
          <h2 className="text-[300px] text-primary-200"> Winepedia</h2>
          <p className="text-text-primary/30 text-[150px] absolute bottom-0 right-10">with you</p>
        </div>
      </section>
    </main>
  );
}
export default MainPage