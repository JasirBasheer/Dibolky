import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setAgency } from '../../redux/slices/agencySlice';
import { setUser } from '../../redux/slices/userSlice';


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
        

        const roleRedirects: IRedirectionUrls = {
          "Agency": '/agency/',
          "Company": '/company/',
          "Employee": '/employee/',
          "Admin": '/admin/'
        };
        console.log(response.data.role ,"Rol");
        
        dispatch(setUser({role:response.data.role,planId:response.data.details.planId}))           
        
        setIsAuthenticated(true);
        if(response.data.role !== role){
          navigate(roleRedirects[response.data.role as keyof typeof roleRedirects ])
        }
        
      }
    } catch (error: any) {
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