import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, BarChart, FileText, Settings,
  DollarSign, FileClock, FileChartColumn, Pen,
  GalleryVertical, CalendarDays, Send,
  ChartNoAxesCombined, ChartBarStacked,
  MessageSquareText, Building2, UserCircle, Shield,
  LucideIcon,
} from 'lucide-react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import ExpandableMenuItem from './expandableMenu-item';
import MenuItem from './menu-Item';
import { useSelector } from 'react-redux';
import axios from '../../../utils/axios';
import { MenuItemType, RootState } from '@/types/common.types';
import { MenuData } from '@/types/client.types';


const icons:Record<string, LucideIcon>  = {
  LayoutDashboard: LayoutDashboard,
  Users: Users,
  BarChart: BarChart,
  FileText: FileText,
  Settings: Settings,
  DollarSign: DollarSign,
  FileClock: FileClock,
  FileChartColumn: FileChartColumn,
  Pen: Pen,
  GalleryVertical: GalleryVertical,
  CalendarDays: CalendarDays,
  Send: Send,
  ChartNoAxesCombined: ChartNoAxesCombined,
  ChartBarStacked: ChartBarStacked,
  MessageSquareText: MessageSquareText,
  Building2: Building2,
  UserCircle: UserCircle,
  Shield: Shield
};



interface SideBarProps {
  isOpen: boolean;
}

const SideBar: React.FC<SideBarProps> = ({ isOpen }) => {
  const location = useLocation();
  const [activeMenus, setActiveMenus] = useState<Record<string, boolean>>({});
  const [menu, setMenu] = useState<MenuData>({});
  const userDetails = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true)


  const fetchMenus = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/client/get-client-details");
      if (response) setMenu(response.data.client.menu);
      setIsLoading(false);
    } catch (error) {
      console.error("Menu Fetch Error:", error);
      setIsLoading(false);
      setMenu({});
    }
  };


  useEffect(() => {
      fetchMenus();
  }, []);

  const menuSkeletons = Array(2).fill(0).map((_, index) => (
    <div key={index} >
      <Skeleton height={55} />
    </div>
  ));


  const toggleMenu = (menuKey: string) => {
    setActiveMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  useEffect(() => {

    const currentPath = location.pathname;

      if (menu) {
        Object.entries(menu as Record<string, MenuItemType>).forEach(([key, menuItem]) => {
          if (menuItem?.subItems) {
            if (menuItem.subItems.some((item) => item.path.includes(currentPath))) {
              setActiveMenus((prev) => ({
                ...prev,
                [key]: true,
              }));
            }
          } else if (menuItem?.path.includes(currentPath)) {
            setActiveMenus((prev) => ({
              ...prev,
              [key]: true,
            }));
          }
  
      });
    }

  }, [location.pathname, menu]);

    const currentPath = useMemo(() => 
      location.pathname.replace('/client', ''), 
      [location.pathname]
    );
  


  const getIcon = (iconName: string) => {
    return icons[iconName as keyof typeof icons] || icons.LayoutDashboard;
  };


  return (

    <div
      className={`lg:relative absolute flex-col lg:w-[19rem] flex w-full lg:h-screen bg-white border-r border-gray-200 ${isOpen ? 'h-screen' : 'h-0'
        } duration-300 transition-all top-0`}
    >
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {isLoading ? (
          <>
            <div className="">
              <Skeleton height={40} />
            </div>
            {menuSkeletons}
          </>
        ) : (
          <>

            <MenuItem
              icon={LayoutDashboard}
              label="Dashboard"
              path={[`/client`]}
              isActive={location.pathname === `/client`}
            />
      {Object.entries(menu as Record<string, MenuItemType>).map(([key, menuItem]) => 
              !menuItem.subItems ? (
                <MenuItem
                  key={key}
                  icon={getIcon(menuItem.icon as string)}
                  label={menuItem.label}
                  path={menuItem.path}
                  isActive={menuItem.path.includes(currentPath)}
                />
                
              ) : (
                <ExpandableMenuItem
                  key={key}
                  icon={menuItem.icon}
                  label={menuItem.label}
                  isOpen={activeMenus[key]}
                  onClick={() => toggleMenu(key)}
                  subItems={menuItem.subItems || []}
                  activeSubPath={currentPath} 
                />
              )
            )}
            <MenuItem
              icon={Settings}
              label="Settings"
              path={[`/${userDetails.role.toLowerCase()}}/settings`]}
              isActive={location.pathname === `/agency/settings`}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SideBar;
