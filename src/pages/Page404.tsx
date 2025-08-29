import Button from '@/component/Button';
import { Link } from 'react-router';

function Page404() {
  return (
    <div className="flex items-center justify-center h-screen gap-30">
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="font-extrabold text-6xl text-center text-primary-500">
            404:ERROR <br />
            Page not found
          </h2>
          <p className="text-center text-[#556987] text-lg">
            요청하신 페이지를 찾을 수 없습니다 <br />
            길을 잃어버리셨나요?
          </p>
        </div>
        <div className="flex items-center flex-col gap-4 text-[#556987] text-[12px]">
          <p>우선 다시 돌아가볼까요?</p>
          <Link to="/">
            <Button size="lg" color="primary">
              <p className="font-bold text-[20px]">Back to Home</p>
            </Button>
          </Link>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden">
        <img src="/image/404image.png" alt="" />
      </div>
    </div>
  );
}
export default Page404;
