/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ArrowUpRight, Clock, Target, BarChart3, PlusCircle } from 'lucide-react';

interface ServiceCardProps {
  data: Record<string, any>;
  setIsServiceOpened: (value: boolean) => any;
  setClickedService:(value:string)=>any;
  item:string;
}

const ServiceCard = ({ data, setIsServiceOpened,setClickedService,item }: ServiceCardProps) => {
  const getIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case 'budget':
        return <BarChart3 className="w-4 h-4 text-blue-500" />;
      case 'targetaudience':
        return <Target className="w-4 h-4 text-purple-500" />;
      case 'marketinggoals':
        return <BarChart3 className="w-4 h-4 text-green-500" />;
      case 'duration':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <PlusCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') {
      return Object.entries(value)
        .map(([key, val]) => `${key}: ${formatValue(val)}`)
        .join(', ');
    }
    return String(value);
  };

  const capitalizeKey = (key: string): string => {
    return key
      .split(/(?=[A-Z])|_/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div 
      className="w-[20rem] mb-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
    
    >
      <div className="p-6 pb-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">
            {data.serviceName}
          </h3>
          <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors duration-300 cursor-pointer"
            onClick={() => {
              setIsServiceOpened(true)
              setClickedService(item)
            }}
          >
            <ArrowUpRight className="w-4 h-4 text-green-600" />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          Project Details
        </h4>
        
        <div className="space-y-3">
          {Object.entries(data.serviceDetails || {}).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-3 group/item">
              <div className="flex-shrink-0">
                {getIcon(key.replace(/\s+/g, ''))}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">
                  {capitalizeKey(key)}
                </p>
                <p className="text-sm text-gray-700 font-semibold">
                  {key === 'budget' && '$'}{formatValue(value)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;






