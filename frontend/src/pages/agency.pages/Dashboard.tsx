import  { useEffect,useState } from 'react'
import {  useSelector } from 'react-redux';
import AgencyDashboard from '../../components/agency.components/agencyside.components/agencyDashoard';
import AgencyClientDashboard from '@/components/agency.components/clientside.components/clientDashboard';
import { RootState } from '@/types/common.types';

const Dashboard = () => {
  const [isAgencyDashboard,setIsAgencyDashboard] = useState(false)
  const user = useSelector((state:RootState)=>state.user)

   useEffect(() => {
    if (user.user_id && user.user_id !== "") {
      setIsAgencyDashboard(false)
    }else{
      setIsAgencyDashboard(true)
    }
  }, [user.role,user.user_id]);
  return (
    isAgencyDashboard?<AgencyDashboard/>:<AgencyClientDashboard/>
  )
}

export default Dashboard

