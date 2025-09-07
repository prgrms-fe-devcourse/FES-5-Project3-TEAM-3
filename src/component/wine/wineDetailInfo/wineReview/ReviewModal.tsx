import { useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import TastingInfo from '../../tasting/TastingInfo';
import ReviewRatings from './ReviewRatings';
import Button from '@/component/Button';
import { useReviewStore } from '@/store/reviewStore';
import { useShallow } from 'zustand/shallow';
import ReviewTagInput from './ReviewTagInput';
import ReviewPairingInput from './ReviewPairingInput';
import { useAuth } from '@/store/@store';
import supabase from '@/supabase/supabase';
import useToast from '@/hook/useToast';
import { pairingCategory } from '../../filterSearch/filterInfo';
import type { Tables, TablesInsert } from '@/supabase/database.types';
import { FocusTrap } from 'focus-trap-react';

export type ReviewSavedPayload = {
  review_id: string;
  wine_id: string;
  rating: number;
  content: string;
  sweetness_score?: number | null;
  acidity_score?: number | null;
  tannin_score?: number | null;
  body_score?: number | null;
  addWineSeller: boolean;
};

type ReviewModalProps = {
  wineId: string;
  wineImage?: string[];
  wineName?: string;
  tags?: Tables<'hashtag_counts'>[];
  pairings?: Tables<'wine_pairings_counts'>[];
  refresh?: () => void;
  onSaved?: (p: ReviewSavedPayload) => void;
};

type HashtagInsert = TablesInsert<'hashtags'>;
type PairingInsert = TablesInsert<'pairings'>;

const pairingCodeToLabel: Record<string, string> = Object.fromEntries(
  Object.entries(pairingCategory).map(([label, code]) => [String(code), label])
);

function ReviewModal({
  wineId,
  wineImage,
  wineName,
  tags: tagsOptProps,
  pairings: pairingOptProps,
  refresh,
  onSaved,
}: ReviewModalProps) {
  const userId = useAuth().userId;

  // Zustand Store
  const {
    isOpen,
    closeModal,
    reset,
    // value
    rating,
    sweetness,
    acidic,
    tannic,
    body,
    content,
    tag,
    pairing,
    // options
    onlyReview,
    addWineSeller,
    // actions
    setContent,
    toggleOnlyReview,
    toggleWineSeller,
    setRating,
    setSweetnessTaste,
    setAcidicTaste,
    setTannicTaste,
    setBodyTaste,
    // mode
    isEditMode,
    setAddWineSeller,
    replaceTags,
    replacePairings,
  } = useReviewStore(
    useShallow((s) => ({
      isOpen: s.isOpen,
      closeModal: s.closeModal,
      reset: s.reset,

      rating: s.rating,
      sweetness: s.sweetness,
      tannic: s.tannic,
      acidic: s.acidic,
      body: s.body,
      content: s.content,
      tag: s.tag,
      pairing: s.pairing,

      onlyReview: s.onlyReview,
      addWineSeller: s.addWineSeller,

      setContent: s.setContent,
      toggleOnlyReview: s.toggleOnlyReview,
      toggleWineSeller: s.toggleWineSeller,

      setRating: s.setRating,
      setSweetnessTaste: s.setSweetnessTaste,
      setAcidicTaste: s.setAcidicTaste,
      setTannicTaste: s.setTannicTaste,
      setBodyTaste: s.setBodyTaste,

      isEditMode: s.isEditMode,
      setAddWineSeller: s.setAddWineSeller,
      replaceTags: s.replaceTags,
      replacePairings: s.replacePairings,
    }))
  );

  const reqIdRef = useRef(0);

  // 렌더링 시킬 와인 정보 및 태그/페어링 리스트
  const [wineNameToRender, setWineNameToRender] = useState<string>(wineName ?? '');
  const [wineImageToRender, setWineImageToRender] = useState<string[] | undefined>(wineImage);

  const [tagOptions, setTagOptions] = useState<string[]>(
    tagsOptProps ? tagsOptProps.map((tag) => tag.tag_text ?? '').filter(Boolean) : []
  );
  const [pairingOptions, setPairingOptions] = useState<string[]>(
    pairingOptProps
      ? pairingOptProps.map(
          (p) =>
            `${pairingCodeToLabel[p.pairing_category ?? '기타'] ?? '기타'}/${p.pairing_name ?? ''}`
        )
      : []
  );

  // const hasMyTags = Array.isArray(tag) && tag.length > 0;
  // const hasMyPairings =
  //   Array.isArray(pairing) &&
  //   pairing.some((p) => {
  //     const [label, value] = Object.entries(p ?? {})[0] ?? [];
  //     return Boolean(label) && Boolean(value);
  //   });

  // 로딩/제출 상태
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // 모달 닫기
  const close = (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.stopPropagation();
    reset();
    closeModal();
  };
  const stopPropagation = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

  // 엔터키 제출
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 줄바꿈 막기
      submitReview();
    }
  };

  // 모달 열릴 때 데이터 로드
  useEffect(() => {
    if (!isOpen || !wineId) return;
    if (!userId) {
      useToast('error', '리뷰를 작성하려면 로그인하셔야 합니다');
      return;
    }

    const myId = ++reqIdRef.current;
    let cancelled = false;

    (async () => {
      setLoading(true);

      try {
        // 와인 기본 정보 Prop에서 못받았으면 가져오기
        if (!wineNameToRender || !wineImageToRender) {
          const { data: wineRes, error: wineErr } = await supabase
            .from('wines')
            .select('name, image_url')
            .eq('wine_id', wineId)
            .single();
          if (!cancelled && !wineErr && wineRes) {
            setWineNameToRender(wineRes.name ?? '');
            setWineImageToRender(wineRes.image_url ?? []);
          }
        }

        // 작성/수정 판단용 DB 조회
        const { data: reviewRes, error: reviewErr } = await supabase
          .from('reviews')
          .select(
            'review_id, rating, content, sweetness_score, acidity_score, tannin_score, body_score, addWineSeller'
          )
          .eq('user_id', userId ?? '')
          .eq('wine_id', wineId)
          .maybeSingle();

        if (cancelled || myId !== reqIdRef.current) return;

        if (!reviewErr && reviewRes) {
          // Edit Mode Prefill
          setRating(reviewRes.rating ?? 0);
          setContent(reviewRes.content ?? '');
          setSweetnessTaste(reviewRes.sweetness_score ?? 0);
          setAcidicTaste(reviewRes.acidity_score ?? 0);
          setTannicTaste(reviewRes.tannin_score ?? 0);
          setBodyTaste(reviewRes.body_score ?? 0);
          if (typeof reviewRes.addWineSeller === 'boolean') {
            const next = reviewRes.addWineSeller;
            if (useReviewStore.getState().addWineSeller !== next) {
              setAddWineSeller(next);
            }
          }
          // tag / pairing prefill
          const [tagRes, pairingRes] = await Promise.all([
            supabase
              .from('hashtags')
              .select('tag_text')
              .eq('review_id', reviewRes.review_id)
              .maybeSingle(),
            supabase
              .from('pairings')
              .select('pairing_category, pairing_name')
              .eq('review_id', reviewRes.review_id),
          ]);

          if (!cancelled) {
            replaceTags(tagRes?.data?.tag_text ?? []);
            const myPairings = pairingRes.data
              ? pairingRes.data.map((p) => {
                  const label = pairingCodeToLabel[p.pairing_category ?? '기타'] ?? '기타';
                  return { [label]: p.pairing_name ?? '' } as Record<string, string>;
                })
              : [];
            replacePairings(myPairings);
          } else {
            // 기본값 세팅
            setRating(0);
            setContent('');
            setSweetnessTaste(0);
            setAcidicTaste(0);
            setTannicTaste(0);
            setBodyTaste(0);
            setAddWineSeller(true);
            replaceTags([]);
            replacePairings([]);
          }

          // 추천 옵션
          if (!tagsOptProps) {
            const { data: tagRows } = await supabase
              .from('hashtags')
              .select('tag_text, wine_id')
              .eq('wine_id', wineId);
            if (!cancelled) {
              const all = (tagRows ?? []).flatMap((r) => r.tag_text ?? []);
              setTagOptions(Array.from(new Set(all)).filter(Boolean));
            }
          }

          if (!pairingOptProps) {
            const { data: pairingRows } = await supabase
              .from('pairings')
              .select('pairing_category, pairing_name')
              .eq('wine_id', wineId);
            if (!cancelled) {
              const all = (pairingRows ?? []).map(
                (p) =>
                  `${pairingCodeToLabel[p.pairing_category ?? '기타'] ?? '기타'}/${p.pairing_name}`
              );
              setPairingOptions(Array.from(new Set(all)));
            }
          }
        }
      } catch (err) {
        console.error('Review Modal Fetch Failed:', err);
        useToast('error', '예상치 못한 오류가 발생했습니다.');
        return;
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, userId, wineId]);

  // Image Fallback
  const displayImage = useMemo(() => {
    if (wineImageToRender && wineImageToRender.length > 0)
      return wineImageToRender[0] ?? wineImageToRender[1];
    return '/image/wineImage.svg';
  }, [wineImageToRender]);

  // Submit
  const submitReview = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    if (!rating) {
      useToast('error', '별점을 입력해주세요');
      return;
    }
    if (!content) {
      useToast('error', '리뷰 내용을 입력해주세요');
      return;
    }

    setSubmitting(true);
    try {
      const base = {
        wine_id: wineId,
        user_id: userId,
        rating,
        content,
        addWineSeller: !!addWineSeller,
        sweetness_score: null,
        acidity_score: null,
        tannin_score: null,
        body_score: null,
      } as {
        wine_id: string;
        user_id: string;
        rating: number;
        content: string;
        addWineSeller: boolean;
        sweetness_score: number | null;
        acidity_score: number | null;
        tannin_score: number | null;
        body_score: number | null;
      };

      if (!onlyReview) {
        base.sweetness_score = sweetness ?? 0;
        base.acidity_score = acidic ?? 0;
        base.tannin_score = tannic ?? 0;
        base.body_score = body ?? 0;
      }

      const { data: upserted, error: rErr } = await supabase
        .from('reviews')
        .upsert(base, { onConflict: 'user_id, wine_id' })
        .select()
        .limit(1);

      if (rErr || !upserted?.[0]) {
        console.error('Data Upsert Error:', rErr);
        useToast('error', '리뷰 저장 중 오류가 발생했습니다.');
        return;
      }

      const reviewId = upserted[0].review_id as string;

      if (!onlyReview) {
        // tag & pairings 기존 데이터 삭제 후 재삽입
        await supabase.from('hashtags').delete().eq('review_id', reviewId);
        if (Array.isArray(tag) && tag.length > 0) {
          const normalizedTags = Array.from(
            new Set(tag.map((t) => t?.trim()).filter(Boolean))
          ).sort((a, b) => a.localeCompare(b));

          const hashtagRow: HashtagInsert = {
            review_id: reviewId,
            user_id: userId,
            wine_id: wineId,
            tag_text: normalizedTags,
          };

          const { error: hErr } = await supabase.from('hashtags').insert(hashtagRow);
          if (hErr) console.error('Hashtag Upsert Error:', hErr);
        }

        await supabase.from('pairings').delete().eq('review_id', reviewId);
        const rows: PairingInsert[] = (pairing ?? [])
          .map((p): PairingInsert | null => {
            const [label, value] = Object.entries(p)[0] ?? [];
            const code = pairingCategory[label] ?? label;
            if (!label || !value) return null;
            return {
              review_id: reviewId,
              user_id: userId,
              wine_id: wineId,
              pairing_category: code,
              pairing_name: value,
            };
          })
          .filter((x): x is PairingInsert => x !== null);

        if (rows.length) {
          const { error: pErr } = await supabase.from('pairings').insert(rows);

          if (pErr) console.error('Pairing Insert Error:', pErr);
        }
      }

      useToast('success', isEditMode ? '리뷰가 수정되었습니다.' : '리뷰가 등록되었습니다.');
      onSaved?.({
        review_id: reviewId,
        wine_id: wineId,
        rating,
        content,
        sweetness_score: onlyReview ? null : (sweetness ?? null),
        acidity_score: onlyReview ? null : (acidic ?? null),
        tannin_score: onlyReview ? null : (tannic ?? null),
        body_score: onlyReview ? null : (body ?? null),
        addWineSeller: !!addWineSeller,
      });

      reset();
      closeModal();
      refresh?.();
    } catch (err) {
      console.error('Review Fetch Failed', err);
      useToast('error', '처리 중 문제가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/25 z-100"
      onClick={close}
    >
      <FocusTrap>
        <div
          className="shadow-2xl bg-background-base rounded-2xl w-180 h-fit p-8 flex flex-col gap-5 align-center"
          onClick={stopPropagation}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl text-text-primary font-semibold">
              {isEditMode ? '리뷰 수정하기' : '리뷰 작성하기'}
            </h2>
            <button type="button" aria-label="모달닫기" onClick={close} className="cursor-pointer">
              <img src="/icon/close.svg" alt="close" className="w-6 h-6" />
            </button>
          </div>
          <div className="flex justify-around items-center gap-5">
            <img src={displayImage} alt={wineName} className="w-20 md:w-22" />
            <div className="flex flex-col justify-center">
              <h3 className="text-text-primary text-xl mb-5 text-left">{wineName}</h3>
              {onlyReview ? (
                <TastingInfo
                  type="readonly"
                  tasting={{ sweetness: 0, tannic: 0, acidic: 0, body: 0 }}
                  style="review"
                  className="w-5 h-5 bg-gray-300"
                  gap="gap-3"
                />
              ) : (
                <TastingInfo
                  type="select"
                  style="review"
                  className="w-5 h-5"
                  tasting={{
                    sweetness: sweetness ?? 0,
                    tannic: tannic ?? 0,
                    acidic: acidic ?? 0,
                    body: body ?? 0,
                  }}
                />
              )}
            </div>
            <div className="flex flex-col justify-center relative max-w-[22rem] w-full">
              <ReviewTagInput
                disabled={onlyReview}
                tagOptions={tagOptions}
                isEditMode={onlyReview}
              />
              <hr className="text-gray-400 p-2" />
              <ReviewPairingInput
                disabled={onlyReview}
                pairingOptions={pairingOptions}
                isEditMode={onlyReview}
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <ReviewRatings type="select" w="w-8" h="h-8" rating={rating ?? undefined} />
            <div className="flex flex-col items-end gap-2">
              <label htmlFor="onlyReview" className="text-text-primary select-none">
                <input
                  type="checkbox"
                  id="onlyReview"
                  checked={onlyReview ?? false}
                  onChange={toggleOnlyReview}
                />{' '}
                리뷰만 작성하기
              </label>
              <label className="text-text-primary">
                <input
                  type="checkbox"
                  checked={addWineSeller ?? false}
                  onChange={toggleWineSeller}
                />{' '}
                나의 와인셀러에 추가
              </label>
            </div>
          </div>
          <form onSubmit={submitReview} className="flex flex-col items-center gap-4">
            <textarea
              className="w-full h-20 bg-white rounded-2xl resize-none p-3"
              placeholder="와인에 대한 솔직한 리뷰를 남겨주세요"
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              value={content ?? ''}
              disabled={loading || submitting}
            />
            <Button fullWidth disabled={loading || submitting}>
              {submitting ? '저장 중...' : isEditMode ? '수정 완료' : '작성 완료'}
            </Button>
          </form>
        </div>
      </FocusTrap>
    </div>,
    document.body
  );
}

export default ReviewModal;
