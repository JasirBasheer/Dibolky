import { LucideProps } from 'lucide-react';
import React, { ComponentType, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface MenuItemProps {
  icon: ReactNode | ComponentType<LucideProps>;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  path?: string[];
}





const MenuItem: React.FC<MenuItemProps> = ({icon: Icon,label,onClick,isActive,path}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (path) navigate(path[0] == "/agency" ? path[0] : "/agency"+path[0]);
    if (onClick) onClick();
  };

  return (
    <div className={`flex text-sm font-medium w-full min-h-[3.2rem] gap-2 items-center pl-9 cursor-pointer transition-all duration-200 ${isActive ? 'bg-blue-50 text-blue-600 dark:text-white dark:bg-[#ffffff1b]' : 'hover:bg-gray-100 dark:hover:bg-[#ffffff1b]'}`}onClick={handleClick}>
      <Icon className={`w-5 h-5 ${isActive ? 'dark:text-[#ffffffc1] text-blue-600' : ''}`} />
      <span>{label}</span>
    </div>
  );
};

export default MenuItem