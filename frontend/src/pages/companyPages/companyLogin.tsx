import { useRef, useState } from 'react';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { message } from "antd";
import { validateEmail, validatePassword } from '../../validation/agencyValidation';
import { SpinnerCircular } from 'spinners-react';


const CompanyLogin:React.FC = () => {
  const [email, setEmail] = useState('jasir@gmail.com');
  const [password, setPassword] = useState('jasir@123');
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent): Promise<any> => {
    e.preventDefault();

    if (!validateEmail(email)) {
      emailRef.current?.focus()
      return message.error('Please enter a valid email address')
    }

    if (!validatePassword(password)) {
      passwordRef.current?.focus()
      return message.error('Please enter a valid Password')
    }

    try {
      setIsLoading(true)
      const response = await axios.post('/api/agency/login', { email, password });
      setIsLoading(false)
      console.log(response)
      if(response.status==200){
        message.success('Successfully Logged in')
        navigate('/agency/dashboard')
        return
      }
      
    } catch (error: any) {
      setIsLoading(false)
      if (error?.response && error?.response.status === 400 && !error?.response.token) {
        message.error("Invalid email or password")    
      }
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-[rgb(213,211,220)] ">
      <div className="sm:w-[35rem] flex sm:h-[29rem] w-full h-full rounded-lg shadow-xl bg-[#f9fafb] ">
        <div className="flex-1 sm:p-9 sm:pl-[4.4rem]   sm:pt-16 p-9 pt-[6rem]  ">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <h2 className="text-3xl font-bold text-black mb-3 ">Welcome Back .</h2>
            <p className='text-black text-[0.8rem] '>Not a memeber ? SignUp</p>
            <div className="space-y-4 py-5">
              <div>
                <input
                  ref={emailRef}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder='Email'
                  className="w-full px-4 py-2 rounded-sm bg-white text-black border border-gray-600 focus:outline-none focus:border-[rgb(110,84,181)]"
                />
              </div>
              <div>
                <input
                  ref={passwordRef}

                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  placeholder='Password'
                  className="w-full px-4 py-2 rounded-sm  bg-white text-black border border-gray-600 focus:outline-none focus:border-[rgb(110,84,181)]"
                />
              </div>
              <div className="flex py-2 items-center">
                <p className='text-black text-[0.8rem] '>Forget password ?</p>
              </div>
              <button
                type="submit"
                className="w-full h-[3rem] flex items-center justify-center bg-blue-600 text-white rounded-sm py-2 px-4 hover:bg-blue-700 transition duration-200 mt-6"
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

export default CompanyLogin;