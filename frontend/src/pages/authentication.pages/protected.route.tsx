import { ReactNode, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setAgency } from '../../redux/slices/agencySlice';
import { setUser } from '../../redux/slices/userSlice';
import { setClient } from '@/redux/slices/clientSlice';


interface IRedirectionUrls {
  agency: string;
  Company: string;
  Employee: string;
  Admin: string;
}

const ProtectedRoute = ({ children, role }: { children: ReactNode, role: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const verifyToken = async (): Promise<void> => {
    try {
      const response = await axios.get(`/api/${role.toLowerCase()}/`);

      if (response.data) {
        if (role == "agency") {
          const res = await axios.get(`/api/agency/owner-details`);
          console.log(res,"response")
          dispatch(setAgency({
            user_id:res.data.details?._id || "",
            main_id: response.data.details._id,
            orgId: response.data.details.orgId,
            organizationName: response.data.details.organizationName,
            ownerName: response.data.details.name,
            industry: response.data.details.industry,
            logo: response.data.details.logo,
            remainingProjects: response.data.details.remainingProjects,
            remainingClients: response.data.details.remainingClients
          }));

          dispatch(setUser({
            name: res.data.details?.name || "",
            email: res.data.details?.email || "",
            orgId: res.data.details?.orgId || "",
            organizationName: res.data.details?.organizationName || "",
            facebookAccessToken: res.data.details?.socialMedia_credentials?.facebook?.accessToken || "",
            instagramAccessToken: res.data.details?.socialMedia_credentials?.instagram?.accessToken || "",
            profile: res.data.details?.profile || "",
            bio: res.data.details?.bio || "",
            role,user_id:res.data.details?._id || "",
            main_id: res.data.details?.main_id || ""
          }))

        } else if (role == "Client" && response?.data.details.orgId && response?.data.details.email) {
          const res = await axios.get(`/api/client/get-client-details`);
          dispatch(setUser({
            name: res.data.client?.name || "",
            email: res.data.client?.email || "",
            orgId: res.data.client?.orgId || "",
            organizationName: res.data.client?.organizationName || "",
            facebookAccessToken: res.data.client?.socialMedia_credentials?.facebook?.accessToken || "",
            instagramAccessToken: res.data.client?.socialMedia_credentials?.instagram?.accessToken || "",
            profile: res.data.client?.profile || "",
            bio: res.data.client?.bio || "",
            role,user_id:res.data.client?._id || "",
            main_id: res.data.client?.main_id || ""
          }))
        } else if (role == "Employee" && response?.data.details.orgId && response?.data.details.email) {
          console.log(response?.data);

        }



        const roleRedirects: IRedirectionUrls = {
          "agency": '/agency',
          "Company": '/company/',
          "Employee": '/employee/',
          "Admin": '/admin/'
        };

        dispatch(setUser({ role: response.data.role, planId: response.data.details.planId }))

        setIsAuthenticated(true);
        if (response.data.role !== role) {
          navigate(roleRedirects[response.data.role as keyof typeof roleRedirects])
        }

      }
    } catch (error: unknown) {
      console.log(error)
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  if (isLoading) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <ScaleLoader />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;