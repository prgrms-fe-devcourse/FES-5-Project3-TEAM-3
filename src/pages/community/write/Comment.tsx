
import { fetchData } from "../store/useCommunityStore";


function BoardComment() {
  const fetch  = fetchData()
  console.log(fetch)
  return (
    <div className="bg-secondary-100 p-4 rounded-lg">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2" >
          <img src="" alt="프로필이미지" />
          <p>nickname</p>
          <p>날짜</p>
          <div className="flex gap-3">
            <button type="button">
              <img src="" alt="수정" />
            </button>
            <button type="button">
              <img src="" alt="삭제" />
            </button>
          </div>
        </div>
        <div>
          content
        </div>
        <div>
          <img src="" alt="좋아요" />
          <p>좋아요카운트</p>
          <img src="" alt="댓글" />
          <p>댓글 카운트</p>
          <p>답글</p>
        </div>
      </div>
    </div>
  );
}
export default BoardComment