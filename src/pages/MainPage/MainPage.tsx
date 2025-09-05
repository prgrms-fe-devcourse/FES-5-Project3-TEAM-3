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
            className="w-full object-cover h-[260px] sm:h-[360px] md:h-[420px] lg:w-screen lg:h-screen"
          />
        </picture>
        <h2 className="absolute left-4 bottom-6 md:left-10 md:bottom-12 lg:left-20 lg:bottom-38 xl:left-85.5 xl:bottom-38 text-primary-100">
          <img
            className="w-40 sm:w-60 md:w-80 lg:w-150"
            src="image/HeroText.png"
            alt="Winepedia explore,taste,enjoy"
          />
        </h2>
      </section>
      <Suspense fallback={<SkeletonMainPage />}>
        <Await resolve={Promise.all([nickname, postData, collectionData])}>
          <section className="bg-radial from-background-base from-60% to-secondary-300 to-100% flex justify-center">
            <div
              className="
                grid w-full max-w-[90rem] mx-auto
                grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                lg:grid-rows-3
                gap-4 lg:gap-5
                px-4 md:px-8 lg:px-0
                py-10 md:py-16 lg:py-34.75
              "
            >
              {wines &&
                wines.map(({ id, src, alt, title, text }) => (
                  <WineGrid key={id} src={src} alt={alt} title={title} text={text} />
                ))}
            </div>
          </section>

          <section>
            <Collection collection={collectionData} />
          </section>

          <section className="mt-12 lg:mt-35 flex flex-col items-center gap-6 lg:gap-8">
            <h3>
              <img
                src="image/Trending posts.png"
                alt="trending posts"
                className="h-8 sm:h-10 lg:h-auto"
              />
            </h3>

            <div className="flex gap-3 w-full justify-center px-4">
              <AnimatedPost>
                {postData.map((post) => (
                  <div
                    key={post.post_id}
                    className="post-card will-change-transform w-full xs:w-64 sm:w-72 md:w-80 lg:w-90"
                  >
                    <Card post={post} />
                  </div>
                ))}
                <ShowMoreBtn />
              </AnimatedPost>
            </div>
          </section>
          <div className="max-w-[90rem] mx-auto px-4 lg:px-10">
            <ScrollToTopButton className="cursor-pointer right-0 lg:mr-23" />
          </div>
        </Await>
      </Suspense>
    </main>
  );
}
export default MainPage;
