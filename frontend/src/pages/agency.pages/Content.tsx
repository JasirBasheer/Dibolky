import AgencyClientContent from '@/components/agency.components/clientside.components/clientContent';
import { setUser } from '@/redux/slices/userSlice';
import  { useEffect,useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const AgencyContent = () => {
  const [isAgency,setIsAgency] = useState(false)
  const dispatch = useDispatch()
  const userDetails = useSelector((state:any)=>state.user)

   useEffect(() => {
    const selectedId = localStorage.getItem('selectedClient');
    if (selectedId && selectedId !== "") {
      setIsAgency(false)
      dispatch(setUser({Id:selectedId,role:"Agency-Client"}))
    }else{
      setIsAgency(true)
      dispatch(setUser({role:"Agency"}))
    }
  }, [userDetails.role,userDetails.Id]);
  return (
    isAgency?<AgencyClientContent/>:<AgencyClientContent/>
  )
}

export default AgencyContent

