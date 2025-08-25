import Button from "@/component/Button"
import Spinner from "@/component/Spinner"
import { Outlet, useNavigate } from "react-router"

function MyPageLayout() {
  const navigate = useNavigate();

  return (
    <div className="myPageContainer w-full h-screen flex justify-center items-center flex-col gap-4 ">
      <div className="w-60 border border-gray-500 p-4">
        <h1>Spinner Test</h1>
        <Spinner size="80px" />
      </div>
      <div className="border border-gray-500 p-4 overflow-y-auto flex flex-col gap-2">
        <h1>Button Test</h1>
        <Button size="lg" borderType="solid" color="primary" onClick={() => navigate("/")}>Button</Button>
        <Button size="md" borderType="solid" color="primary">Button</Button>
        <Button size="sm" borderType="solid" color="primary">Button</Button>
        <Button size="lg" borderType="solid" color="primary" disabled>Button</Button>
        <Button size="md" borderType="solid" color="primary" disabled>Button</Button>
        <Button size="sm" borderType="solid" color="primary" disabled>Button</Button>
        <Button size="lg" borderType="outline" color="primary">Button</Button>
        <Button size="md" borderType="outline" color="primary">Button</Button>
        <Button size="sm" borderType="outline" color="primary">Button</Button>
        <Button size="lg" borderType="outline" color="primary" disabled>Button</Button>
        <Button size="md" borderType="outline" color="primary" disabled>Button</Button>
        <Button size="sm" borderType="outline" color="primary" disabled>Button</Button>
        <Button size="lg" borderType="solid" color="secondary">Button</Button>
        <Button size="md" borderType="solid" color="secondary">Button</Button>
        <Button size="sm" borderType="solid" color="secondary">Button</Button>
        <Button size="lg" borderType="solid" color="secondary" disabled>Button</Button>
        <Button size="md" borderType="solid" color="secondary" disabled>Button</Button>
        <Button size="sm" borderType="solid" color="secondary" disabled>Button</Button>
        <Button size="lg" borderType="outline" color="secondary">Button</Button>
        <Button size="md" borderType="outline" color="secondary">Button</Button>
        <Button size="sm" borderType="outline" color="secondary">Button</Button>
        <Button size="lg" borderType="outline" color="secondary" disabled>Button</Button>
        <Button size="md" borderType="outline" color="secondary" disabled>Button</Button>
        <Button size="sm" borderType="outline" color="secondary" disabled>Button</Button>
      </div>
      <Outlet></Outlet>
    </div>
  )
}
export default MyPageLayout