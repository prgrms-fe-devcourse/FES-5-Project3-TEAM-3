import WineGrid from '@/pages/MainPage/WineGrid';
import { useState } from 'react';
import Collection from '@/pages/MainPage/Collection';
import ShowMoreBtn from '@/pages/MainPage/ShowMoreBtn';
import useToast from '@/hook/useToast';


function MainPage() {
  const winesArr = [
    {
      id: 0,
      src: '/image/CS.png',
      alt: '카베르네소비뇽',
      title: 'Cabernet Sauvignon',
      text: `진한 바디와 강렬한 탄닌,스테이크와 완벽한 조화`,
    },
    {
      id: 1,
      src: '/image/FranceWine.png',
      alt: '프랑스와인',
      title: 'France',
      text: `고전 와인의 본 고장 지역별로 다른 매력을 발견하세요`,
    },
    {
      id: 2,
      src: '/image/melot.png',
      alt: '멜롯',
      title: 'Melot',
      text: `부드럽고 과일향 가득, 누구나 즐기기 좋은 와인`,
    },
    {
      id: 3,
      src: '/image/italyWine.png',
      alt: '이탈리아와인',
      title: 'Italy',
      text: `다채로운 품종과 음식 궁합,와인의 천국`,
    },
    {
      id: 4,
      src: '/image/pinotNoir.png',
      alt: '피노누아',
      title: 'Pinot Noir',
      text: `가볍고 섬세한 향, 초보자에게 추천하는 레드 와인`,
    },
    {
      id: 5,
      src: '/image/spainWine.png',
      alt: '스페인 와인',
      title: 'Spain',
      text: `합리적인 가격과 개성 강한 레드 와인의 보물창고`,
    },

    {
      id: 6,
      src: '/image/chardonay.png',
      alt: '샤도네이',
      title: 'Chardonnay',
      text: `버터리하거나 상큼하거나, 스타일이 다양한 화이트 와인`,
    },
    {
      id: 7,
      src: '/image/usaWine.png',
      alt: '미국와인',
      title: 'USA',
      text: `혁신과 전통이 공존하는, 세계가 주목하는 와인 산지`,
    },
    {
      id: 8,
      src: '/image/shauvignonBlanc.png',
      alt: '소비뇽 블랑',
      title: 'Sauvignon Blanc',
      text: `상쾌한 산미와 허브향, 여름에 딱 맞는 화이트 와인`,
    },
  ];

  const [wines] = useState(winesArr);

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
        <div className="flex gap-4">
          <button className="w-20 h-10" onClick={() => useToast('success', '성공')}>
            Success
          </button>
          <button onClick={()=>useToast('warn','경고')}>Warn</button>
          <button className="w-20 h-10" onClick={() => useToast('error', '실패')}>
            Fail
          </button>
          <button onClick={()=>useToast('info','정보')}>Info</button>
        </div>
        <img
          className="block w-screen h-screen"
          src="/image/HeroImg.png"
          alt=",와인과 석류 이미지"
        />
        <h2 className="absolute left-85.5 bottom-38 text-primary-100 text-[108px]">
          <img src="image/HeroText.png" alt="Winepedia explore,taste,enjoy" />
        </h2>
      </section>

      <section className="bg-radial from-background-base from-60% to-secondary-300/40 to-100% flex justify-center">
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
