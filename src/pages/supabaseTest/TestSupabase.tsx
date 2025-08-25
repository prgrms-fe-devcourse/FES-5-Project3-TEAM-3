import supabase from '@/supabase/supabase';

// supabase 테스트용
function TestSupabase() {
  const getWineData = async () => {
    const { data, error } = await supabase.from('wines').select('*');
    if (error) console.error(error);
    else console.log('와인데이터', data);
  };
  const getHashTagData = async () => {
    const { data, error } = await supabase.from('hashtags').select('*');
    if (error) console.error(error);
    else console.log('해시태그', data);
  };
  const getPairingData = async () => {
    const { data, error } = await supabase.from('pairings').select('*');
    if (error) console.error(error);
    else console.log('페어링', data);
  };
  const getPostLikeData = async () => {
    const { data, error } = await supabase.from('post_like').select('*');
    if (error) console.error(error);
    else console.log('포스트좋아요', data);
  };
  const getPostData = async () => {
    const { data, error } = await supabase.from('posts').select('*');
    if (error) console.error(error);
    else console.log('포스트', data);
  };
  const getReplyData = async () => {
    const { data, error } = await supabase.from('reply').select('*');
    if (error) console.error(error);
    else console.log('댓글', data);
  };
  const getReplyLikeData = async () => {
    const { data, error } = await supabase.from('reply_like').select('*');
    if (error) console.error(error);
    else console.log('댓글좋아요', data);
  };
  const getReviewData = async () => {
    const { data, error } = await supabase.from('reviews').select('*');
    if (error) console.error(error);
    else console.log('리뷰', data);
  };
  const getReviewLikeData = async () => {
    const { data, error } = await supabase.from('review_like').select('*');
    if (error) console.error(error);
    else console.log('리뷰좋아요', data);
  };

  // 뱃지, 프로필, 위시리스트는 로그인 후 auth.id와 일치하는 정보만 볼 수 있도록 RLS 설정함
  // 현재는 test1234 사용자의 데이터밖에 없어서 select("*")로 작성해도 동작합니다
  const getUserBadgeData = async () => {
    const { data, error } = await supabase.from('user_badge').select('*');
    if (error) console.error(error);
    else console.log('뱃지', data);
  };
  const getUserProfileData = async () => {
    const { data, error } = await supabase.from('profile').select('*');
    if (error) console.error(error);
    else console.log('사용자프로필', data);
  };
  const getWishlistData = async () => {
    const { data, error } = await supabase.from('wishlists').select('*');
    if (error) console.error(error);
    else console.log('위시리스트', data);
  };

  // 하드코딩된 test1234 사용자로 로그인
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) console.error(error);
    else console.log('로그인성공!', data);
  };
  // 로그아웃
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
    else console.log('로그아웃 성공!');
  };

  return (
    <div>
      <h2>🖱️ 클릭하면 데이터 콘솔에 찍혀용</h2>
      <button type="button" onClick={getWineData}>
        와인데이터 가져오기
      </button>
      <button type="button" onClick={getHashTagData}>
        해시태그 데이터 가져오기
      </button>
      <button type="button" onClick={getPairingData}>
        페어링 데이터 가져오기
      </button>
      <button type="button" onClick={getPostLikeData}>
        포스트좋아요 데이터 가져오기
      </button>
      <button type="button" onClick={getPostData}>
        포스트 데이터 가져오기
      </button>
      <button type="button" onClick={getReplyData}>
        댓글 데이터 가져오기
      </button>
      <button type="button" onClick={getReplyLikeData}>
        댓글 좋아요 데이터 가져오기
      </button>
      <button type="button" onClick={getReviewData}>
        리뷰 데이터 가져오기
      </button>
      <button type="button" onClick={getReviewLikeData}>
        리뷰좋아요 데이터 가져오기
      </button>

      <hr />

      <button type="button" onClick={() => login('test1234@test.com', 'test1234')}>
        로그인
      </button>
      <button type="button" onClick={getUserProfileData}>
        사용자프로필 데이터 가져오기
      </button>
      <button type="button" onClick={getUserBadgeData}>
        뱃지 데이터 가져오기
      </button>
      <button type="button" onClick={getWishlistData}>
        위시리스트 데이터 가져오기
      </button>
      <button type="button" onClick={logout}>
        로그아웃
      </button>
    </div>
  );
}

export default TestSupabase;
