import axios from '../../utils/axios';
import { ReactNode, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';


interface IRedirectionUrls {
  agency: string;
  admin: string;
  client: string;
  influencer: string
}



const UnProtectedRoute = ({ children, role }: { children: ReactNode, role: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const verifyToken = async (): Promise<void> => {
    try {
      const response = await axios.get(`/api/${role.toLowerCase()}/`);

      console.log(response);

      if (response.status == 200) {
        setIsAuthenticated(true);

        if (response) {

          const roleRedirects: IRedirectionUrls = {
            "agency": '/agency',
            "admin": '/admin/',
            "client": "/client/",
            "influencer": "/influencer/",

          };

          const redirectPath = roleRedirects[response.data?.role as keyof typeof roleRedirects];
          navigate(redirectPath)
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error: unknown) {
      console.log("error", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, [role]);

  if (isLoading) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <ScaleLoader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return null;
}

export default UnProtectedRoute;