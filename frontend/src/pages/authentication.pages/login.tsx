import { useEffect, useRef, useState } from 'react';
import axios from '../../utils/axios';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Link, useNavigate } from 'react-router-dom';
import { message } from "antd";
import { validateEmail, validatePassword } from '../../validation/agencyValidation';
import { SpinnerCircular } from 'spinners-react';
import { useSearchParams } from 'react-router-dom';

interface LoginProps {
  role: string;
}
interface IRedirectionUrls {
  agency: string;
  Company: string;
  Employee: string;
  Admin: string;
  Client: string;
}

const Login = ({ role }: LoginProps) => {
  const [email, setEmail] = useState('jasirbinbasheerpp@gmail.com');
  const [password, setPassword] = useState('Jasir@123');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [searchParams] = useSearchParams();
  const isNewlyCreatedAccount = searchParams.get('new')
  const [token, setToken] = useState<string>("");



  useEffect(() => {
    if (isNewlyCreatedAccount) {
      message.success("Account successfully created")
      message.success("Login to continue")
    }
  }, [])


  const onVerify = (token: string) => {
    setToken(token);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateEmail(email)) {
      emailRef.current?.focus()
      message.error('Please enter a valid email address')
      return
    }

    if (!validatePassword(password)) {
      passwordRef.current?.focus()
      message.error('Please enter a valid Password')
      return
    }

    try {
      setIsLoading(true)
      const response = await axios.post('/api/auth/login', { email, password, role });
      setIsLoading(false)

      if (response && response.status == 200) {
        message.success('Successfully Logged in')
        const roleRedirects: IRedirectionUrls = {
          "agency": "/agency",
          "Company": "/company/",
          "Employee": "/employee",
          "Admin": "/admin/",
          "Client": "/client/",
        }
        const url = roleRedirects[role as keyof typeof roleRedirects]
        navigate(url)

      }

    } catch (error: unknown) {
      setIsLoading(false);
      if (
        error instanceof Error && typeof error === "object" && "response" in error && typeof error.response === "object" && error.response !== null && "data" in error.response &&
        typeof error.response.data === "object" && error.response.data !== null && "error" in error.response.data && typeof error.response.data.error === "string"
      ) {
        message.error(error.response.data.error);
      } else {
        message.error("Unexpected error occurred");
      }

    }


  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="sm:w-[35rem] flex sm:h-[34rem] w-full h-full rounded-lg shadow-xl bg-white">
        <div className="flex-1 sm:p-9 sm:pl-[4.4rem]   sm:pt-14 p-9 pt-[7rem]  ">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <h2 className="text-3xl font-bold text-black mb-3 ">Welcome Back .</h2>
            <div className="space-y-4 py-4">
              <div>
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  ref={emailRef}
                  id='Email'
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder='Email'
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="Password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  ref={passwordRef}
                  id='Password'
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  placeholder='Password'
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex py-2 items-center">
                <p className='text-black text-[0.8rem] cursor-pointer '><Link to={`/${role.toLocaleLowerCase()}/forgot-password`}>Forget password ?</Link></p>
              </div>
              <HCaptcha
                sitekey="10000000-ffff-ffff-ffff-000000000001"
                onVerify={onVerify}
              />

              <button
                disabled={token == ""}
                type="submit"
                className="w-full h-[3rem] flex items-center justify-center bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition duration-200 mt-6"
              >
                {isLoading ?
                  <SpinnerCircular size={20} thickness={200} speed={100} color="rgba(255, 255, 255, 1)" secondaryColor="rgba(0, 0, 0, 0.44)" />
                  : <>Login</>}
              </button>
            </div>
          </form>


        </div>
      </div>
    </div>
  )
};

export default Login;