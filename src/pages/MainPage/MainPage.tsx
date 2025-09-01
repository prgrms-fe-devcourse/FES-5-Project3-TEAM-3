import WineGrid from '@/component/MainPage/WineGrid';
import ShowMoreBtn from '@/component/MainPage/ShowMoreBtn';
import Collection from '@/component/MainPage/Collection';
import { winesArr } from '@/assets/staticArr';
import supabase from '@/supabase/supabase';
import type { Tables } from '@/supabase/database.types';
import { Suspense } from 'react';
import SkeletonMainPage from './skeleton/SkeletonMainPage';
import { useLoaderData, type LoaderFunctionArgs,  } from 'react-router';


type User = { profile: { nickname: string } }
type ReviewRow = Tables<'reviews'> & {
  profile: Pick<Tables<'profile'>, 'nickname'>;
  wines: Tables<'wines'>;
};
type LoaderData = Awaited<ReturnType<typeof MainPageLoader>>;

  const getUser = async () => {
    const { data, error } = await supabase
      .from('user_badge')
      .select('profile(nickname)')
      .contains('badge_type', ['Apprentice Sommelier']);
    if (error) console.error(error)
    const random = data?.map(a => a.profile.nickname)
     if (!random) return;
    const index = Math.floor(Math.random() * random?.length)
    return random[index]
  };

  const getCollection = async (nickname: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*,profile(nickname),wines(*)')
      .eq('profile.nickname',nickname)
      .limit(5);
    if (error) console.error(error);
    return data;
  };

  const getPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*').limit(4)
      .order('like_count', { ascending: false });
    if (error) console.error(error);
    return data;
  };

export async function MainPageLoader() {
  const [nickname, postData] = await Promise.all([getUser(), getPosts()])
  const collectionData = nickname && await getCollection(nickname) 
  return {nickname,postData,collectionData}
  } 


function MainPage() {
  const wines = winesArr;
  const {postData, collectionData} = useLoaderData() as LoaderData

 console.log(collectionData)

  return (
    <Suspense fallback={<SkeletonMainPage/>}>
      <main>
        <section className="relative">
          <img
            className="block w-screen h-screen"
            src="/image/HeroImg.png"
            alt="와인과 석류 이미지"
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
          <Collection collection={collectionData} />
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
    </Suspense>
  );
}
export default MainPage;
