import WineGrid from '@/component/MainPage/WineGrid';
import ShowMoreBtn from '@/component/MainPage/ShowMoreBtn';
import Collection from '@/component/MainPage/Collection';
import { winesArr } from '@/assets/staticArr';

function MainPage() {
  const wines = winesArr

  const collection = [
    {
      id: 1,
      title: 'Château Haut-Brion 1986',
      content: 'GOAT... 무슨 말이 더 필요할까요 가격이 만만치 않지만 죽기 전 꼭 먹어봐야합니다.',
      price: '3,800,000',
      src: 'image/winebottle.png',
      icon: 'image/FR.png',
    },
    {
      id: 2,
      title: 'Château Haut-Brion 1987',
      content: 'GOAT... 무슨 말이 더 필요할까요 가격이 만만치 않지만 죽기 전 꼭 먹어봐야합니다.',
      price: '3,800,000',
      src: 'image/winebottle.png',
      icon: 'image/FR.png',
    },
    {
      id: 3,
      title: 'Château Haut-Brion 1988',
      content: 'GOAT... 무슨 말이 더 필요할까요 가격이 만만치 않지만 죽기 전 꼭 먹어봐야합니다.',
      price: '3,800,000',
      src: 'image/winebottle.png',
      icon: 'image/FR.png',
    },
    {
      id: 4,
      title: 'Château Haut-Brion 1989',
      content: 'GOAT... 무슨 말이 더 필요할까요 가격이 만만치 않지만 죽기 전 꼭 먹어봐야합니다.',
      price: '3,800,000',
      src: 'image/winebottle.png',
      icon: 'image/FR.png',
    },
  ];

  return (
    <main>
      <section className="relative">
        <img
          className="block w-screen h-screen"
          src="/image/HeroImg.png"
          alt=",와인과 석류 이미지"
        />
        <h2 className="absolute left-85.5 bottom-38 text-primary-100 text-[108px]">
          <img src="image/HeroText.png" alt="Winepedia explore,taste,enjoy" />
        </h2>
      </section>

      <section className="bg-radial from-background-base from-60% to-secondary-300 to-100% flex justify-center">
        <div className="grid grid-rows-3 grid-cols-3 gap-5 py-34.75">
          {wines &&
            wines.map(({ id, src, alt, title, text }) => (
              <WineGrid key={id} src={src} alt={alt} title={title} text={text} />
            ))}
        </div>
      </section>

      <section>
        <Collection collection={collection} />
      </section>

      <section className="h-200 mt-35 flex flex-col items-center">
        <h3 className="text-[108px]">
          <img src="image/Trending posts.png" alt="trending posts" />
        </h3>
        <div className="mt-13 flex items-center">
          <div className="rounded-2xl w-70 h-90 bg-gray-600"></div>
          <ShowMoreBtn />
        </div>
      </section>
    </main>
  );
}
export default MainPage;
