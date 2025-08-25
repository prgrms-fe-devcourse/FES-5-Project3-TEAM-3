import Spinner from "@/component/Spinner"
import { Outlet } from "react-router"

function MyPageLayout() {
  return (
    <div className="myPageContainer w-full h-screen flex justify-center items-center ">
      <div className="w-60 h-60 border border-gray-500 p-4 overflow-y-auto">
        <h1>Scroll Test</h1>
        <p className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident molestiae expedita sint odio cumque aliquid vero ratione facere nam! Exercitationem laudantium officiis porro voluptas nulla inventore dolore sapiente natus iusto.</p>
      </div>
      <div className="w-60 h-60 border border-gray-500 p-4 overflow-y-auto">
        <h1>Spinner Test</h1>
        <Spinner size="80px" />
      </div>
      <Outlet></Outlet>
    </div>
  )
}
export default MyPageLayout