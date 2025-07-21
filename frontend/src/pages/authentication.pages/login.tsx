import { memo } from "react";
import { Link } from "react-router-dom";
import LoginForm from '@/components/common/auth/login'

const Login = ({ role }: {role:string}) => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="sm:w-[35rem] flex sm:h-[34rem] w-full h-full rounded-lg shadow-xl bg-white">
        <div className="flex-1 sm:p-9 sm:pl-[4.4rem] sm:pt-14 p-9 pt-[7rem]">
          <LoginForm role={role} />
          <div className="flex py-2 items-center">
            <p className="text-black text-[0.8rem] cursor-pointer">
              <Link to={`/${role.toLowerCase()}/forgot-password`}>Forget password?</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Login);
