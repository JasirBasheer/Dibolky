import { Route, Routes } from 'react-router-dom'
import AdminRoutes from './routes/admin'
import PortalRoutes from './routes/portal'
import AgencyRoutes from './routes/agency'
import ClientRoutes from './routes/client'
import ManagerRoutes from './routes/manager'
import InfluencerRoutes from './routes/influencer'

const App = () => {
  return (
    <Routes>
      <Route path='/*' element={<PortalRoutes />} />
      <Route path='/admin/*' element={<AdminRoutes />} />
      <Route path='/agency/*' element={<AgencyRoutes />} />
      <Route path='/client/*' element={<ClientRoutes />} />
      <Route path='/influencer/*' element={<InfluencerRoutes />} />
      <Route path='/manager/*' element={<ManagerRoutes />} />
    </Routes>
  )
}
export default App