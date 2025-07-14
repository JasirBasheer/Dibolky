import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import CustomBreadCrumbs from '../ui/custom-breadcrumbs';

const Inbox = () => {
  const [selectedTab, setSelectedTab] = useState("not-replied");
  
  return (
    <>
     <CustomBreadCrumbs
        breadCrumbs={[
          ["Communications", "/agency/inbox"],
          ["Inbox", ""],
        ]}
      />
    <div className="sm:flex h-screen w-full mx-auto border-r  border-l-gray-300 bg-white">
      <div className="sm:w-[34em] w-full p-5 h-full border-r  border-l-gray-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My Inbox</h1>
       
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <span>Platfroms</span>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 3C4.67157 3 4 3.67157 4 4.5C4 5.32843 4.67157 6 5.5 6C6.32843 6 7 5.32843 7 4.5C7 3.67157 6.32843 3 5.5 3ZM3 4.5C3 3.11929 4.11929 2 5.5 2C6.88071 2 8 3.11929 8 4.5C8 5.88071 6.88071 7 5.5 7C4.11929 7 3 5.88071 3 4.5ZM9.5 9C8.67157 9 8 9.67157 8 10.5C8 11.3284 8.67157 12 9.5 12C10.3284 12 11 11.3284 11 10.5C11 9.67157 10.3284 9 9.5 9ZM7 10.5C7 9.11929 8.11929 8 9.5 8C10.8807 8 12 9.11929 12 10.5C12 11.8807 10.8807 13 9.5 13C8.11929 13 7 11.8807 7 10.5ZM1.5 4C1.22386 4 1 4.22386 1 4.5C1 4.77614 1.22386 5 1.5 5H2.5C2.77614 5 3 4.77614 3 4.5C3 4.22386 2.77614 4 2.5 4H1.5ZM8 4.5C8 4.22386 8.22386 4 8.5 4H13.5C13.7761 4 14 4.22386 14 4.5C14 4.77614 13.7761 5 13.5 5H8.5C8.22386 5 8 4.77614 8 4.5ZM1.5 10C1.22386 10 1 10.2239 1 10.5C1 10.7761 1.22386 11 1.5 11H6.5C6.77614 11 7 10.7761 7 10.5C7 10.2239 6.77614 10 6.5 10H1.5ZM12 10.5C12 10.2239 12.2239 10 12.5 10H13.5C13.7761 10 14 10.2239 14 10.5C14 10.7761 13.7761 11 13.5 11H12.5C12.2239 11 12 10.7761 12 10.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuCheckboxItem
              checked={true}
              onSelect={(e) => {
                e.preventDefault();
                setSelectedTab('facebook');
              }}
              >
              Facebook
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={true}
              onSelect={(e) => {
                e.preventDefault();
                setSelectedTab('instagram');
              }}
              >
              Instagram
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={true}
              onSelect={(e) => {
                e.preventDefault();
                setSelectedTab('linkedin');
              }}
              >
              Linkedin
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={true}
              onSelect={(e) => {
                e.preventDefault();
                setSelectedTab('x');
              }}
              >
              X (Twitter)
            </DropdownMenuCheckboxItem>
          
          </DropdownMenuContent>
        </DropdownMenu>

          
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