import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setAgency } from '../../redux/slices/agencySlice';
import { setUser } from '../../redux/slices/userSlice';
import { setClient } from '@/redux/slices/clientSlice';


interface IRedirectionUrls {
  Agency: string;
  Company: string;
  Employee: string;
  Admin: string;
}

const ProtectedRoute = ({ children,role }: { children: any,role:string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const verifyToken = async (): Promise<void> => {
    try {
      const response = await axios.get(`/api/${role.toLowerCase()}/`);
      
      if (response.data) {
        if(role == "Agency"){
          dispatch(setAgency({
            id: response.data.details._id,
            orgId: response.data.details.orgId,
            organizationName: response.data.details.organizationName,
            ownerName: response.data.details.name,
            email: response.data.details.email,
            industry: response.data.details.industry,
            logo: response.data.details.logo,
            remainingProjects: response.data.details.remainingProjects,
            remainingClients: response.data.details.remainingClients
          }));
        }else if (role == "Client"&& response?.data.details.orgId && response?.data.details.email){
          const res = await axios.get(`/api/client/get-client-details`);
          dispatch(setClient({
            id: res.data.client._id,
            orgId: res.data.client.orgId,
            name: res.data.client.name,
            email: res.data.client.email,
            services: res.data.client.services
          }));
        }else if(role == "Employee" && response?.data.details.orgId && response?.data.details.email){
          console.log(response?.data);
          
        }
   
        

        const roleRedirects: IRedirectionUrls = {
          "Agency": '/agency',
          "Company": '/company/',
          "Employee": '/employee/',
          "Admin": '/admin/'
        };
        
        dispatch(setUser({role:response.data.role,planId:response.data.details.planId}))           
        
        setIsAuthenticated(true);
        if(response.data.role !== role){
          navigate(roleRedirects[response.data.role as keyof typeof roleRedirects ])
        }
        
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
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