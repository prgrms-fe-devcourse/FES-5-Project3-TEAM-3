import { Outlet } from "react-router"

function Root() {
  return (
    <div className="flex flex-col w-screen h-screen">
      <header>Header</header>
      <main>
        <Outlet></Outlet>
      </main>
      <footer>footer</footer>
    </div>
  )
}
export default Root