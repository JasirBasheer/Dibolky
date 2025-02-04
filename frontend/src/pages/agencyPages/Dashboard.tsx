import { setUser } from '@/redux/slices/userSlice';
import  { useEffect,useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import AgencyDashboard from '../../components/agency.components/agencyside.components/agencyDashoard';
import AgencyClientDashboard from '@/components/agency.components/clientside.components/clientDashboard';

const Dashboard = () => {
  const [isAgencyDashboard,setIsAgencyDashboard] = useState(false)
  const dispatch = useDispatch()
  const userDetails = useSelector((state:any)=>state.user)

   useEffect(() => {
    const selectedId = localStorage.getItem('selectedClient');
    if (selectedId && selectedId !== "") {
      setIsAgencyDashboard(false)
      dispatch(setUser({Id:selectedId,role:"Agency-Client"}))
    }else{
      setIsAgencyDashboard(true)
      dispatch(setUser({role:"Agency"}))
    }
  }, [userDetails.role,userDetails.Id]);
  return (
    isAgencyDashboard?<AgencyDashboard/>:<AgencyClientDashboard/>
  )
}

export default Dashboard

