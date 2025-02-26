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
    },
    {
      title: "Influencer",
      description: "Access your influencer dashboard",
      link: "/influencer/login",
      icon: <User className="w-12 h-12 text-purple-500" />
    },
    {
      title: "Account Manager",
      description: "Access your manager dashboard",
      link: "/manager/login",
      icon: <Users className="w-12 h-12 text-purple-500" />
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
    <div className="p-6 md:p-8">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
        <CircleArrowLeft className="w-6 h-6" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome Back</h1>
        <p className="text-gray-600">Choose your login portal to continue</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {options.map((item) => (
          <Link
            key={item.title}
            to={item.link}
            className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border"
          >
            <div className="p-6">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6 ">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
  );
};

export default MainLoginPage;