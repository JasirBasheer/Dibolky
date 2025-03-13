import { LucideProps } from 'lucide-react';
import React, { ComponentType, ReactNode } from 'react';
import {  useNavigate } from 'react-router-dom';


interface SubItemProps {
  icon: ReactNode | ComponentType<LucideProps>;
  label: string;
  path: string[];
  isActive: boolean;
  onClick?: () => void;
}


const SubMenuItem: React.FC<SubItemProps> = ({icon: Icon,label,path,isActive,onClick}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/agency"+path[0]);
    if (onClick) onClick();
  };

  return (
    <div
      className={`flex text-sm font-medium w-full min-h-[2.8rem] gap-2 items-center pl-16 cursor-pointer transition-colors
        ${isActive ? 'dark:bg-[#ffffff1b] bg-blue-50 text-blue-600' : 'hover:bg-gray-100 dark:bg-[#ffffff1b]'}`} onClick={handleClick} >
      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : ''}`} />
      <span>{label}</span>
    </div>
  );
};

export default SubMenuItem