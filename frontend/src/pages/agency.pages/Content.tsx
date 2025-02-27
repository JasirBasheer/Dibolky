import AgencyClientContent from '@/components/agency.components/content';
import { RootState } from '@/types/common.types';
import  { useEffect,useState } from 'react'
import {  useSelector } from 'react-redux';

const AgencyContent = () => {
  const [isAgency,setIsAgency] = useState(false)
  const user = useSelector((state:RootState)=>state.user)

   useEffect(() => {
      setIsAgency(user && user.user_id !== "")
     }, [user.role,user.user_id]);
  return (
    isAgency?<AgencyClientContent/>:<AgencyClientContent/>
  )
}

export default AgencyContent

