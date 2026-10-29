import { BrowserRouter, Route, Routes } from "react-router-dom"


import useAuthRoutes from "./hooks/useAuthRoutes"
import PublicFacilityMap from "./pages/facilityMap/PublicFacilityMap"


const App = () => {



  return (
    <BrowserRouter>
      <Routes>
        {/* open page for office monitors: no login, no sidebar */}
        <Route path="/facility-map/live" element={<PublicFacilityMap />} />
        {/* everything else behaves exactly as before */}
        <Route path="*" element={<RoutesWrapper />} />
      </Routes>
    </BrowserRouter>

  )
}


const RoutesWrapper = () => {
  const r = useAuthRoutes();
  return r
}

export default App