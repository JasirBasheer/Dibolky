import React, { ComponentType, ReactNode } from 'react';
import SubMenuItem from './subMenu-item';
import {
    LayoutDashboard, Users, BarChart, FileText, Settings,
    DollarSign, FileClock, FileChartColumn, Pen,
    GalleryVertical, CalendarDays, Send,
    ChartNoAxesCombined, ChartBarStacked,
    MessageSquareText, Building2, UserCircle, Shield,
    ChevronDown,
    LucideIcon,
    LucideProps
  } from 'lucide-react';
  
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
  
  


interface MenuItemProps {
    icon: string;
    label: string;
    onClick?: () => void;
    isActive?: boolean;
}

interface ExpandableMenuItemProps extends MenuItemProps {
    isOpen: boolean;
    subItems: Array<{
        icon: ReactNode | ComponentType<LucideProps> | string;
        label: string;
        path: string[];
    }>;
    activeSubPath?: string;
}


const ExpandableMenuItem: React.FC<ExpandableMenuItemProps> = ({ 
    icon: iconName, 
    label, 
    isOpen, 
    onClick, 
    subItems, 
    activeSubPath 
}) => {
    const Icon = icons[iconName];

    const isActive = subItems?.some(item => item.path.includes(activeSubPath || '')) || false;

    return (
        <>
            <div
                className={`flex text-sm font-medium w-full min-h-[3.2rem] gap-2 items-center pl-9 cursor-pointer relative ${isOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}
            ${isActive ? 'text-blue-600' : ''} transition-all duration-200`} 
                onClick={onClick}
            >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
                <span>{label}</span>
                <ChevronDown 
                    className={`absolute w-4 h-4 right-7 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isActive ? 'text-blue-600' : ''} `} 
                />
            </div>
            <div 
                className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}
            >
                <div className="bg-gray-50 py-1">
                    {subItems?.map((item, index) => (
                        <SubMenuItem 
                            key={index} 
                            icon={icons[item.icon as string]} 
                            label={item.label} 
                            path={item.path} 
                            isActive={(item.path || []).includes(activeSubPath || '')}
                        />
                    ))}
                    {(!subItems || subItems.length === 0) && (
                        <div className='flex items-center justify-center text-sm p-7 ml-5'>
                            <p>
                                <span className='text-blue-600 underline cursor-pointer'>Upgrade</span> your plan for {label} module.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};


export default ExpandableMenuItem