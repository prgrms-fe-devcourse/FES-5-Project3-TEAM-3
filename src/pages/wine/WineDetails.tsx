import Button from '@/component/Button';
import TastingReviewChart from '@/component/wine/wineDetailInfo/TastingReviewChart';
import WineBasicInfo from '@/component/wine/wineInfo/WineBasicInfo';
import supabase from '@/supabase/supabase';
import { computeTaste } from '@/utils/convertTasteInfo';
import { Suspense, useEffect, useState } from 'react';
import { Await, Link, useLoaderData, useParams, type LoaderFunctionArgs } from 'react-router';
import type { WineInfoType } from './Wines';
import type { Tables } from '@/supabase/database.types';
import ItemsContainer from '@/component/wine/wineDetailInfo/ItemsContainer';
import ReviewRatings from '@/component/wine/wineDetailInfo/wineReview/ReviewRatings';
import RatingSummary from '@/component/wine/wineDetailInfo/wineReview/RatingSummary';
import ReviewContainer from '@/component/wine/wineDetailInfo/wineReview/ReviewContainer';
import ReviewModal from '@/component/wine/wineDetailInfo/wineReview/ReviewModal';
import Spinner from '@/component/Spinner';
import { useReviewStore } from '@/store/reviewStore';
import useToast from '@/hook/useToast';
import { useAuth } from '@/store/@store';

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
    .order('tag_count', { ascending: false });

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

export const getWineReview = async (wineId: string) => {
  const { data, error } = await supabase.from('reviews').select().eq('wine_id', wineId);
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
  const tagData = await getWineTag(wineId);
  const pairingData = await getPairings(wineId);
  const reviewData = await getWineReview(wineId);

  return {
    wines: wineData,
    tags: tagData,
    pairings: pairingData,
    reviews: reviewData,
  };
}

function WineDetails() {
  // 데이터 fetch -> props로 못 받음 : supabase에 올려서 디테일정보 가져오기, 주소도 와인인덱스말고 id로 하기
  const data = useLoaderData() as {
    wines: Promise<WineInfoType[]>;
    tags: Tables<'hashtag_counts'>[];
    pairings: Tables<'pairings'>[];
    reviews: Tables<'reviews'>[];
  };

  const { wineId } = useParams();
  const openModal = useReviewStore((state) => state.openModal);

  const [reviews, setReviews] = useState(data.reviews);

  const [reviewRating, setReviewRating] = useState([0, 0, 0, 0, 0]);
  const [averageRating, setAverageRating] = useState(0);
  const [averageTaste, setAverageTaste] = useState({ sweetness: 0, acidic: 0, tannic: 0, body: 0 });
  const [reviewers, setReviewers] = useState(0);
  const [rating] = useState(averageRating); // supabase에서 가져오기
  const user = useAuth().userId;

  useEffect(() => {
    if (!reviews || reviews.length === 0) {
      setReviewRating([0, 0, 0, 0, 0]);
      setAverageRating(0);
      setAverageTaste({ sweetness: 0, acidic: 0, tannic: 0, body: 0 });
      setReviewers(0);
      return;
    }

    const newReviewRating = [0, 0, 0, 0, 0];
    const newTasteRating = { sweetness: 0, acidic: 0, tannic: 0, body: 0 };
    let total = 0;
    let validTasteCount = 0;

    reviews.forEach((r) => {
      const rating = r.rating ?? 0;
      total += rating;

      const sweetness = r.sweetness_score ?? 0;
      const acidic = r.acidity_score ?? 0;
      const tannic = r.tannin_score ?? 0;
      const body = r.body_score ?? 0;

      if (sweetness || acidic || tannic || body) validTasteCount++;

      newTasteRating.sweetness += sweetness;
      newTasteRating.acidic += acidic;
      newTasteRating.tannic += tannic;
      newTasteRating.body += body;

      if (rating > 4) newReviewRating[0]++;
      else if (rating > 3) newReviewRating[1]++;
      else if (rating > 2) newReviewRating[2]++;
      else if (rating > 1) newReviewRating[3]++;
      else if (rating > 0) newReviewRating[4]++;
    });

    setReviewRating(newReviewRating);
    setAverageRating(Number((total / reviews.length).toFixed(1)));
    setAverageTaste(
      validTasteCount > 0
        ? {
            sweetness: newTasteRating.sweetness / validTasteCount,
            acidic: newTasteRating.acidic / validTasteCount,
            tannic: newTasteRating.tannic / validTasteCount,
            body: newTasteRating.body / validTasteCount,
          }
        : { sweetness: 0, acidic: 0, tannic: 0, body: 0 }
    );
    setReviewers(reviews.length);
  }, [reviews]);

  const openReviewModal = () => {
    if (!user) useToast('error', '리뷰를 작성하시려면 로그인해주세요');
    else openModal();
  };

  if (!wineId) return;

  const refreshReviews = async () => {
    const newReviews = await getWineReview(wineId);
    setReviews(newReviews ?? []);
  };

  return (
    <>
      <Suspense fallback={<Spinner className="m-auto h-[calc(100vh-12.125rem)]" />}>
        <Await resolve={data.wines}>
          {(wines) => {
            console.log(wines);
            if (wines.length === 0) {
              return (
                <div className="w-full h-[calc(100vh-12.125rem)] flex justify-center items-center text-2xl gap-30">
                  <img src="/image/404image.png" alt="" className="w-80 rounded-2xl" />
                  <h2 className="font-extrabold text-6xl text-center text-primary-500">
                    Wine not found
                    <p className="text-center text-[#556987] text-lg font-bold pt-5">
                      요청하신 와인을 찾을 수 없습니다 <br />
                      길을 잃어버리셨나요?
                    </p>
                    <Link to="/wines">
                      <Button size="lg" color="primary">
                        <p className="font-bold text-[20px]">Back to WineList</p>
                      </Button>
                    </Link>
                  </h2>
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
                          reviewData={[
                            averageTaste.sweetness,
                            averageTaste.acidic,
                            averageTaste.tannic,
                            averageTaste.body,
                          ]}
                        />
                      </div>
                      <div className="h-fit flex justify-center w-full">
                        <p className="m-auto text-lg">리뷰</p>
                        <ReviewRatings rating={rating} w="w-8" h="h-8" />
                        <p className="m-auto">{rating} / 5</p>
                      </div>
                    </div>
                  </div>
                  <Await resolve={data.tags}>
                    {(tags) => <ItemsContainer items={tags.slice(0, 5)} type="tags" />}
                  </Await>
                  <Await resolve={data.pairings}>
                    {(pairings) => <ItemsContainer items={pairings} type="pairings" />}
                  </Await>
                  <h3 className="text-xl">이 와인 드셔보셨나요 ? 리뷰를 작성해주세요</h3>
                  <Button
                    type="button"
                    className="bg-secondary-800 self-center enabled:hover:bg-secondary-700 text-lg mb-5"
                    onClick={openReviewModal}
                  >
                    리뷰작성하기
                  </Button>
                  <div className="w-full flex items-center justify-center flex-wrap gap-20 py-5">
                    <RatingSummary
                      rating={averageRating}
                      reviewerCount={reviewers}
                      ratingChartData={reviewRating}
                    />
                    <ReviewContainer reviews={reviews} refresh={refreshReviews} />
                  </div>
                </div>
                {
                  <ReviewModal
                    wineId={w.wine_id}
                    wineImage={w.image_url}
                    wineName={w.name}
                    pairings={data.pairings}
                    tags={data.tags}
                    refresh={refreshReviews}
                  />
                }
              </>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}

export default WineDetails;
