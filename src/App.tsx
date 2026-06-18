import { BrowserRouter } from "react-router-dom"


import useAuthRoutes from "./hooks/useAuthRoutes"


const App = () => {



  return (
    <BrowserRouter>
      <RoutesWrapper />
    </BrowserRouter>

  )
}


const RoutesWrapper = () => {
  const r = useAuthRoutes();
  return r
}

export default App