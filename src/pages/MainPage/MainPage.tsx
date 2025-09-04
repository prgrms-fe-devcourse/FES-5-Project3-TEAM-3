import WineGrid from '@/component/MainPage/WineGrid';
import ShowMoreBtn from '@/component/MainPage/ShowMoreBtn';
import Collection from '@/component/MainPage/Collection';
import { winesArr } from '@/assets/staticArr';
import supabase from '@/supabase/supabase';
import { Suspense } from 'react';
import SkeletonMainPage from './skeleton/SkeletonMainPage';
import { Await, useLoaderData } from 'react-router';
import type { Tables } from '@/supabase/database.types';
import Card from '../community/Main/Card';
import AnimatedPost from '@/component/MainPage/AnimatedPost';
import ScrollToTopButton from '@/component/community/ScrollToTopButton';

type Review = Tables<'reviews'>;
type Wine = Tables<'wines'>;
type Post = Tables<'posts'>;
type Collection = Review & {
  profile: Pick<Tables<'profile'>, 'nickname'> | null;
  wines: Wine | null;
};
type LoaderData = {
  nickname: string | null | undefined;
  postData: Post[];
  collectionData: Collection[];
};

export const getUser = async () => {
  const { data, error } = await supabase
    .from('user_badge')
    .select('profile(nickname)')
    .contains('badge_type', ['Apprentice Sommelier']);
  if (error) console.error(error);
  const random = data?.map((a) => a.profile.nickname);
  if (!random) return;
  const index = Math.floor(Math.random() * random?.length);
  return random[index];
};

export const getCollection = async (nickname: string): Promise<Collection[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*,profile(nickname),wines(*)')
    .eq('profile.nickname', nickname)
    .limit(5);
  if (error) console.error(error);
  return data ?? [];
};

export const getPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*,profile(nickname)')
    .limit(4)
    .order('like_count', { ascending: false });
  if (error) console.error(error);
  return data ?? [];
};

export async function MainPageLoader(): Promise<LoaderData> {
  const nickname = await getUser();
  const [postData, collectionData] = await Promise.all([
    getPosts(),
    nickname ? getCollection(nickname) : Promise.resolve<Collection[]>([]),
  ]);

  return { nickname, postData, collectionData };
}

function MainPage() {
  const wines = winesArr;
  const { nickname, postData, collectionData } = useLoaderData() as LoaderData;

  return (
    <main>
      <section className="relative">
        <picture>
          <source media="(min-width:1024px)" srcSet="/image/HeroImg.png" />

          <img
            src="/image/mobileHeroImg.png"
            alt="와인과 석류 이미지"
            className="w-full h-100 object-cover lg:w-screen lg:h-screen"
          />
        </picture>
        <h2 className="absolute left-5 bottom-10 lg:left-20 lg:bottom-38  xl:absolute xl:left-85.5 xl:bottom-38 text-primary-100 text-[108px]">
          <img className="w-150" src="image/HeroText.png" alt="Winepedia explore,taste,enjoy" />
        </h2>
      </section>
      <Suspense fallback={<SkeletonMainPage />}>
        <Await resolve={Promise.all([nickname, postData, collectionData])}>
          <section className="bg-radial from-background-base from-60% to-secondary-300 to-100% flex justify-center">
            <div className="grid grid-rows-3 grid-cols-3  gap-5  py-34.75">
              {wines &&
                wines.map(({ id, src, alt, title, text }) => (
                  <WineGrid key={id} src={src} alt={alt} title={title} text={text} />
                ))}
            </div>
          </section>

          <section>
            <Collection collection={collectionData} />
          </section>

          <section className="h-200 mt-35 flex flex-col items-center gap-8">
            <h3>
              <img src="image/Trending posts.png" alt="trending posts" />
            </h3>

            <div className="flex gap-3  justify-between w-full ">
              <AnimatedPost>
                {postData.map((post) => (
                  <div key={post.post_id} className="post-card will-change-transform w-90">
                    <Card post={post} />
                  </div>
                ))}
                <ShowMoreBtn />
              </AnimatedPost>
            </div>
          </section>
          <ScrollToTopButton className="cursor-pointer right-0 lg:mr-23" />
        </Await>
      </Suspense>
    </main>
  );
}
export default MainPage;
