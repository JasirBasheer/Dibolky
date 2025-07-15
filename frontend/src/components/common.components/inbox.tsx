import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomBreadCrumbs from '../ui/custom-breadcrumbs';
import { PlatformFilter } from './platfrom-filter';
import { useQuery } from '@tanstack/react-query';
import { fetchConnections } from '@/services/common/get.services';
import { useSelector } from 'react-redux';
import { RootState } from '@/types/common.types';

const Inbox = () => {
  const [selectedTab, setSelectedTab] = useState("not-replied");
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  
  const user = useSelector((state: RootState) => state.user);
  
  const { data: connections } = useQuery({
    queryKey: ["get-connections-status"],
    queryFn: () => {
      return fetchConnections(user.role, user.user_id)
    },
    select: (data) => data?.data,
    enabled: !!user.user_id,
    staleTime: 1000 * 60 * 60,
  });

  // Handle filter changes from PlatformFilter component
  const handleFilterChange = (connections: string[], platforms: string[]) => {
    setSelectedConnections(connections);
    setSelectedPlatforms(platforms);
  };

  return (
    <>
      <CustomBreadCrumbs
        breadCrumbs={[
          ["Communications", "/agency/inbox"],
          ["Inbox", ""],
        ]}
      />
      <div className="sm:flex h-screen w-full mx-auto border-r border-l-gray-300 bg-white">
        <div className="sm:w-[34em] w-full p-5 h-full border-r border-l-gray-300">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">My Inbox</h1>
            <PlatformFilter 
              connections={connections}
              onFilterChange={handleFilterChange}
              selectedConnections={selectedConnections}
              selectedPlatforms={selectedPlatforms}
            />
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search messages" 
              className="pl-10 bg-slate-50 border-slate-200"
            />
          </div>

          <Tabs defaultValue="not-replied" className="mb-6">
            <TabsList className="grid grid-cols-3 bg-slate-100">
              <TabsTrigger value="not-replied" onClick={() => setSelectedTab("not-replied")} className="flex gap-2 items-center">
                All
              </TabsTrigger>
              <TabsTrigger value="open" onClick={() => setSelectedTab("open")} className="flex gap-2 items-center">
                Not Replied
              </TabsTrigger>
              <TabsTrigger value="replied" onClick={() => setSelectedTab("replied")}>Replied</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Message list would go here */}
          <div className="flex-1 overflow-y-auto">
            {/* Replace this with your actual message list */}
            {[].length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-xs">Make sure you have selected pages too.</p>
                <p className="text-gray-500 text-sm">No messages match your current filters.</p>
              </div>
            ) : (
              <div>
                {/* Your message components would go here */}
                {[].map((message, index) => (
                  <div key={index} className="p-3 border-b">
                    {/* Message component */}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex items-center justify-center pb-24">
          <div className="mb-4 text-center">
            <span className="text-4xl">👋</span>
            <h2 className="text-3xl font-bold mt-2">Hi, from Dibolky</h2>
            <p className="text-slate-500 mb-24">Your have no messages</p>
            <p className="text-slate-500">Please select a conversation to view messages</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Inbox;