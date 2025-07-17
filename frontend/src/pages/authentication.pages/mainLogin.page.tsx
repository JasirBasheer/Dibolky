import React from 'react';
import { Activity,  Users, UserCircle, CircleArrowLeft, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const MainLoginPage:React.FC = () => {
  const options = [
    {
      title: "Agency",
      description: "Access agency portal and management tools",
      link: "/agency/login",
      icon: <Activity className="w-12 h-12 text-blue-500" />
    },
    {
      title: "Client",
      description: "View your client portal",
      link: "/client/login",
      icon: <UserCircle className="w-12 h-12 text-orange-500" />
    }
  ];

  return (
    <div className="min-h-screen dark:bg-[#181e2a] bg-gray-50 ">
    <div className="p-6 md:p-8">
      <Link to="/" className="inline-flex items-center gap-2 dark:text-white text-gray-600 hover:text-[#868383] transition-colors">
        <CircleArrowLeft className="w-6 h-6" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:mt-14">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold font-lazare dark:text-white text-gray-900 mb-1">Welcome Back</h1>
        <p className="font-bold font-lazare text-gray-600 dark:text-gray-300">Choose your login portal to continue</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {options.map((item) => (
          <Link
            key={item.title}
            to={item.link}
            className="group relative border bg-white dark:bg-[#182234] rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 overflow-hidden "
          >
            <div className="p-6">
              <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-[#2d3a50] flex items-center justify-center mb-6 ">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold font-lazare dark:text-white text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400  font-bold font-lazare text-sm">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
  );
};

export default MainLoginPage;