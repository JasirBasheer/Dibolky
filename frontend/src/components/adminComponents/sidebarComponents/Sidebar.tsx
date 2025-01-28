import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, BarChart, FileText, Settings,
  DollarSign, FileClock, FileChartColumn, Pen,
  GalleryVertical, CalendarDays, Send,
  ChartNoAxesCombined, ChartBarStacked,
  MessageSquareText, Building2, UserCircle, Shield,
} from 'lucide-react';
import ExpandableMenuItem from './ExpandableMenuItem';
import MenuItem from './MenuItem';

let icons: any = {
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


const menu:any ={
  clients: {
      label: 'All Clients',
      icon: 'Users',
      path: ['/admin/clients']
  },
  plans: {
      label: 'All Plans',
      icon: 'GalleryVertical',
      path: ['/admin/plans']
  },
  reports: {
      label: "Reports",
      icon: 'MessageSquareText',
      path: ['/admin/reports']
  }
}


interface SideBarProps {
  isOpen: boolean;
}

const SideBar: React.FC<SideBarProps> = ({ isOpen }) => {
  const location = useLocation();
  const [activeMenus, setActiveMenus] = useState<Record<string, boolean>>({});


  const toggleMenu = (menuKey: string) => {
    setActiveMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  useEffect(() => {
    const currentPath = location.pathname;

    if (menu) {
      Object.entries(menu).forEach(([key, menuItem]: [any, any]) => {
        if (menuItem && menuItem.subItems) {
          if (menuItem.subItems.some((item: any) => item.path.includes(currentPath))) {
            setActiveMenus((prev) => ({
              ...prev,
              [key]: true,
            }));
          }
        } else if (menuItem?.path && menuItem.path.includes(currentPath)) {
          setActiveMenus((prev) => ({
            ...prev,
            [key]: true,
          }));
        }
      });
    }
  }, [location.pathname, menu]);

  return (
    <div
      className={`lg:relative absolute flex-col lg:w-[19rem] flex w-full md:h-screen bg-white border-r border-gray-200 ${isOpen ? 'h-screen' : 'h-0'
        } duration-300 transition-all top-0`}
    >
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">

      <MenuItem
          icon={LayoutDashboard}
          label="Dashboard"
          path={[`/admin/`]}
          isActive={location.pathname === `/admin/`}
        />
        {Object.entries(menu).map(([key, menu]: [any, any]) => {
          console.log(menu?.subItems)
          if (!menu?.subItems) {
            const icon = icons[menu.icon]
            return (
              <MenuItem
                key={key}
                icon={icon}
                label={menu.label}
                path={menu.path}
                isActive={menu.path.includes(location.pathname)}
              />
            );
          }else{
            return (
              <ExpandableMenuItem
              key={key}
              icon={menu.icon}
              label={menu.label}
              isOpen={activeMenus[key]}
              onClick={() => toggleMenu(key)}
              subItems={menu.subItems}
              activeSubPath={location.pathname}
              />
            );
          }
        })}
        <MenuItem
          icon={Settings}
          label="Settings"
          path={[`/admin/settings`]}
          isActive={location.pathname === `/admin/settings`}
        />
      </div>
    </div>
  );
};

export default SideBar;
