import AgencyClientContent from '@/pages/contents/contents';
import { RootState } from '@/types/common';
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

