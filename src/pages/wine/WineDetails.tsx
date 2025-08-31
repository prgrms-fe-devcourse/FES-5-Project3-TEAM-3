import Button from '@/component/Button';
import TastingReviewChart from '@/component/wine/wineDetailInfo/TastingReviewChart';
import WineBasicInfo from '@/component/wine/wineInfo/WineBasicInfo';
import supabase from '@/supabase/supabase';
import { computeTaste } from '@/utils/convertTasteInfo';
import { Suspense, useReducer, useState } from 'react';
import { Await, useLoaderData, useParams, type LoaderFunctionArgs } from 'react-router';
import type { WineInfoType } from './Wines';
import type { Tables } from '@/supabase/database.types';
import ItemsContainer from '@/component/wine/wineDetailInfo/ItemsContainer';
import ReviewRatings from '@/component/wine/wineDetailInfo/wineReview/ReviewRatings';
import RatingSummary from '@/component/wine/wineDetailInfo/wineReview/RatingSummary';
import ReviewContainer from '@/component/wine/wineDetailInfo/wineReview/ReviewContainer';
import ReviewModal from '@/component/wine/wineDetailInfo/wineReview/ReviewModal';
import { initialState, reviewReducer } from '@/hook/useReviewModal';
import Spinner from '@/component/Spinner';
import { useReviewStore } from '@/store/reviewStore';

export const getWineDetails = async (id: string) => {
  const { data, error } = await supabase.from('wines').select().eq('wine_id', id);
  if (error) {
    console.error(error);
    return null;
  }
  return data;
};

export const getWineTag = async (id: string) => {
  const { data, error } = await supabase
    .from('hashtag_counts')
    .select()
    .contains('wine_ids', [id])
    .order('tag_count', { ascending: false })
    .limit(5);

  if (error) {
    console.error(error);
    return null;
  }
  return data;
};

export const getPairings = async (id: string) => {
  const { data, error } = await supabase.from('pairings').select().eq('wine_id', id);
  console.log(data, error);
  if (error) {
    console.error(error);
    return null;
  }
  console.log(data);
  return data;
};

export const getWineReview = async (id: string) => {
  const { data, error } = await supabase.from('reviews').select().eq('wine_id', id);
  if (error) {
    console.error(error);
    return null;
  }
  return data;
};

export async function wineDetailLoader({ params }: LoaderFunctionArgs) {
  const { wineId } = params;
  if (!wineId) throw new Error('wineId가 없습니다');
  const wineData = getWineDetails(wineId);
  const tagData = getWineTag(wineId);
  const pairingData = getPairings(wineId);
  const reviewData = getWineReview(wineId);
  return { wines: wineData, tags: tagData, pairings: pairingData, reviews: reviewData };
}

function WineDetails() {
  // 데이터 fetch -> props로 못 받음 : supabase에 올려서 디테일정보 가져오기, 주소도 와인인덱스말고 id로 하기
  const { wineId } = useParams();
  const [rating] = useState(3.7); // supabase에서 가져오기
  const openModal = useReviewStore((state) => state.openModal);

  if (!wineId) return;

  const data = useLoaderData() as {
    wines: Promise<WineInfoType[]>;
    tags: Promise<Tables<'hashtag_counts'>[]>;
    pairings: Promise<Tables<'pairings'>[]>;
    reviews: Promise<Tables<'reviews'>[]>;
  };

  return (
    <>
      <Suspense fallback={<Spinner />}>
        <Await resolve={data.wines}>
          {(wines) => {
            if (!wines) {
              return (
                <div className="w-full h-full flex justify-center items-center">
                  와인 정보를 찾을 수 없습니다.
                </div>
              );
            }
            const w = wines[0];

            return (
              <>
                <div className="m-auto flex flex-col justify-center items-center gap-4 select-none lg:px-5 xl:px-30">
                  <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-5 lg:gap-10 xl:gap-20 py-5 flex-wrap md:wrap-normal">
                    <img
                      src={
                        w.image_url.length !== 0
                          ? (w.image_url[1] ?? w.image_url[0])
                          : '/image/wineImage.svg'
                      }
                      alt={w.name}
                      className="h-full"
                      draggable="false"
                    />
                    <WineBasicInfo wineBasicInfo={w} type="detail" />
                    <div className="w-3/4 md:w-85 flex flex-col justify-center items-center p-5 gap-10">
                      <div className="w-full md:w-80 h-80">
                        <p className="flex justify-end items-center gap-2">
                          리뷰<span className="rounded-full bg-secondary-300 w-4 h-4"></span>공식
                          <span className="rounded-full bg-primary-500 w-4 h-4"></span>
                        </p>
                        <TastingReviewChart
                          infoData={[
                            (computeTaste(w.sweetness) as number) ?? 0,
                            (computeTaste(w.acidic) as number) ?? 0,
                            (computeTaste(w.tannic) as number) ?? 0,
                            (computeTaste(w.body) as number) ?? 0,
                          ]}
                          reviewData={[1, 2, 3, 4]}
                        />
                      </div>
                      <div className="h-fit flex justify-center w-full">
                        <p className="m-auto text-lg">리뷰</p>
                        <ReviewRatings rating={rating} />
                        <p className="m-auto">{rating}</p>
                      </div>
                    </div>
                  </div>
                  {/* <Await resolve={data.tags}>{(tags)=><TagContainer/>}</Await> */}
                  <Await resolve={data.tags}>
                    {(tags) => <ItemsContainer items={tags} type="tags" />}
                  </Await>
                  <Await resolve={data.pairings}>
                    {(pairings) => <ItemsContainer items={pairings} type="pairings" />}
                  </Await>
                  {/* TODO : supabase에서 태그 많은순으로 가져와서 렌더링하기 */}
                  {/* TODO : supabase에서 페어링 많은순으로 가져와서 렌더링하기 */}
                  <h3 className="text-xl">이 와인 드셔보셨나요 ? 리뷰를 작성해주세요</h3>
                  <Button
                    type="button"
                    className="bg-secondary-800 self-center enabled:hover:bg-secondary-700 text-lg mb-10"
                    onClick={openModal}
                  >
                    리뷰작성하기
                  </Button>
                  <div className="w-full flex items-center justify-center flex-wrap gap-20">
                    <RatingSummary />
                    <Await resolve={data.reviews}>
                      {(reviews) => <ReviewContainer reviews={reviews} />}
                    </Await>
                  </div>
                </div>
                {<ReviewModal wineImage={w.image_url} wineName={w.name} />}
              </>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}

export default WineDetails;
