import { useState } from "react";
import {
  Check,
  GitCommitHorizontal,
  MoreVertical,
  Settings,
  User,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { IConnection, RootState } from "@/types/common";
import { fetchConnections } from "@/services/common/get.services";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import ProfileContents from "./components/editProfile";
import CustomBreadCrumbs from "../../components/ui/custom-breadcrumbs";
import Skeleton from "react-loading-skeleton";
import { getSocialMediaIcon } from "@/utils/utils";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("about");
  const user = useSelector((state: RootState) => state.user);

  const { data: connections, isLoading } = useQuery({
    queryKey: ["get-connections-status"],
    queryFn: () => {
      return fetchConnections(user.role, user.user_id, `?includes=pages`);
    },
    select: (data) => data?.data?.connections,
    enabled: !!user.user_id,
    staleTime: 1000 * 60 * 60,
  });

  function formatRelativeTime(
    dateString: Date | string,
    addSuffix: boolean = true
  ): string {
    try {
      const date = parseISO(String(dateString));
      return formatDistanceToNow(date, { addSuffix });
    } catch {
      return dateString as string;
    }
  }

  const ConnectionContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm font-medium">
          This is the list of all connections that you made.
        </p>
      </div>

      <div className="w-full space-y-4">
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-bold text-[0.7rem] text-gray-600">
                  INTEGRATION
                </TableHead>
                <TableHead className="font-bold text-[0.7rem] text-gray-600">
                  SYNC
                </TableHead>
                <TableHead className="font-bold text-[0.7rem] text-gray-600">
                  CREATED AT
                </TableHead>
                <TableHead className="font-bold text-[0.7rem] text-gray-600">
                  ACTIONS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableCell colSpan={4} >
                  <Skeleton count={3} height={31} />
                </TableCell>
              ) : connections && connections.length > 0 ? (
                connections.map((connection: IConnection, index: number) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center bg-blue-100 text-blue-600 rounded-full w-7 h-7">
                          <svg
                            viewBox="0 0 24 24"
                            width="16"
                            height="16"
                            fill="currentColor"
                          >
                            <path d={getSocialMediaIcon(connection.platform)} />
                          </svg>
                        </span>
                        {connection.platform}
                      </div>
                    </TableCell>

                    <TableCell>
                      {connection.is_valid ? (
                        <span className="flex items-center justify-center bg-green-100 text-green-600 rounded-full w-6 h-6">
                          <Check className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="flex items-center justify-center bg-red-100 text-red-600 rounded-full w-6 h-6">
                          <X className="h-4 w-4" />
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatRelativeTime(connection.connectedAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Re connect</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center ">
                      <p className="text-gray-500">No connections found.</p>
                      <p className="text-sm text-gray-400">
                        Connect your social media accounts to get started.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return <ProfileContents />;
      case "connections":
        return <ConnectionContent />;
      default:
        return <div className="py-10 text-center">asdf</div>;
    }
  };
  const tabs = [
    { id: "about", label: "About", icon: <User size={18} /> },
    {
      id: "connections",
      label: "Connections",
      icon: <GitCommitHorizontal size={18} />,
    },
    {
      id: "account-security",
      label: "Account Security",
      icon: <Settings size={18} />,
    },
  ];
  return (
    <>
      <CustomBreadCrumbs
        breadCrumbs={[
          [
            "Tools & Settings",
            `/${user.role == "client" ? "client" : "agency"}/settings`,
          ],
          ["Settings", ""],
        ]}
      />
      <div className="dark:bg-[#191919] pb-7">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="md:flex">
                <div className="w-full md:w-64 bg-white border-r border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium">Settings</h2>
                    <p className="text-sm text-gray-500">Manage your account</p>
                  </div>
                  <nav className="py-4">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-6 py-3 text-sm ${
                          activeTab === tab.id
                            ? "bg-blue-50 text-blue-600  border-blue-600"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <span className="mr-3">{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>
                <div className="flex-1 p-6">
                  <h2 className="text-xl font-medium mb-6">
                    {tabs.find((tab) => tab.id === activeTab)?.label} Settings
                  </h2>
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
