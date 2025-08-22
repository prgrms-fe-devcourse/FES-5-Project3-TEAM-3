import { RouterProvider } from "react-router"
import { routes } from "./router/routes"

function App() {

  return (
    <div>
      <RouterProvider router={routes} />
    </div>
  )
}

export default App
