import { useEffect, useState } from "react";
import { CreditCard, Mail, WrapText, Zap } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/types/common";
import {
  fetchConnections,
  getConnectSocailMediaUrlApi,
} from "@/services/common/get.services";
import {
  handleLinkedinAndXCallbackApi,
  savePlatformTokenApi,
} from "@/services/common/post.services";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs";
import { MailIntegrationsContent } from "./components/mailIntegrations";
import { SocialIntegrationsContent } from "./components/socialIntegrations";
import { PaymentIntegrationsContent } from "./components/paymentIntegrations";
import Connecting from "./components/connecting";
import FutureIntegrations from "@/components/common/futureIntegrations";
import LeadIntegrationsContent from "./components/leadIntegrations";

const Integrations = () => {
  const user = useSelector((state: RootState) => state.user);
  const agency = useSelector((state: RootState) => state.agency);
  const [activeTab, setActiveTab] = useState("social-integrations");
  const [required, setRequired] = useState<string[]>([]);
  const [isFutureModalOpen, setIsFutureModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get("tab");

    if (tab) setActiveTab(tab);

    const hash = window.location.hash;
    const provider = searchParams.get("provider");
    const token = new URLSearchParams(hash.substring(1)).get("access_token");
    if (hash && provider) {
      if (token) {
        setIsConnecting(true);
        handleCallback(token, provider).then(() => {
          window.history.replaceState({}, "", `${window.location.pathname}`);
          setActiveTab("social-integrations");
          setIsConnecting(false);
        });
      }
    }

    if (provider == "linkedin" || provider == "x" || provider == "gmail") {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      console.log(code, state, "reached");
      if (code) {
        setIsConnecting(true);
        handleCallback(code, provider, state).then(() => {
          window.history.replaceState({}, "", `${window.location.pathname}`);
          setIsConnecting(false);
        });
      }
    }
    const required = searchParams.get("required")?.split(",") || [];
    if (required.length > 0) {
      setRequired(required);
      toast.warning("Please connect the required platforms");
    }
  }, []);

  const selectedClient = localStorage.getItem("selectedClient");

  const isAgency = selectedClient && agency.user_id === selectedClient;

  const role = isAgency ? "agency" : "client";
  const userId = isAgency
    ? agency.user_id
    : agency.user_id != user.user_id
    ? user.user_id
    : selectedClient;

  const { data: connections, isLoading: isConnectionLoading } = useQuery({
    queryKey: ["get-connections-status", role, userId, selectedClient],
    queryFn: () => {
      return fetchConnections(role, userId);
    },
    select: (data) => data?.data.connections,
    enabled: !!userId,
    staleTime: 1000 * 60 * 60,
  });

  const handleCallback = async (
    token: string,
    provider: string,
    state?: string
  ): Promise<object | undefined> => {
    try {
      let tokens;
      console.log("callback triggered", token, provider);
      if (provider == "linkedin" || provider == "x" || provider == "gmail") {
        const response = await handleLinkedinAndXCallbackApi(
          token,
          provider,
          state
        );
        if (!response) throw new Error("token not found");
        console.log("reached here here is the response", response);
        if (response) tokens = response.data.tokens;
        console.log(response.data.tokens, "callbacke");
      } else {
        tokens = { accessToken: token };
      }

      const response = await savePlatformTokenApi(
        role,
        provider,
        userId,
        tokens
      );

      if (response) {
        await queryClient.resetQueries({
          queryKey: ["get-connections-status", role, userId, selectedClient],
        });

        toast.success(`${provider} connected successfully`);
        return response;
      } else {
        toast.error(
          `faced some issues while connect ${provider} please try again later `
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in handleCallback:", error.message);
      } else {
        console.error("Error in handleCallback:", error);
      }
      throw error;
    }
  };

  const handleConnectSocailMedia = async (
    connectionEndpoint: string,
    platform: string
  ): Promise<void> => {
    try {
      const futureIntegrations = ["outlook", "googleads"];
      if (futureIntegrations.includes(platform)) {
        setIsFutureModalOpen(true);
        return;
      }
      const urlQuery = new URL(window.location.href);
      urlQuery.searchParams.set("provider", platform);
      const redirectUri = encodeURIComponent(urlQuery.toString());
      const state = user.role == "client" ? "client" : "agency";

      const response = await getConnectSocailMediaUrlApi(
        `${connectionEndpoint}?redirectUri=${redirectUri}&state=${state}`
      );

      const url = new URL(response?.data.url);
      window.location.href = url.toString();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error);
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "social-integrations":
        return (
          <SocialIntegrationsContent
            required={required}
            connections={connections}
            handleConnectSocailMedia={handleConnectSocailMedia}
            isConnectionLoading={isConnectionLoading}
          />
        );
      case "payment-integrations":
        return <PaymentIntegrationsContent />;
      case "mail-integrations":
        return (
          <MailIntegrationsContent
            required={required}
            handleConnectSocailMedia={handleConnectSocailMedia}
            connections={connections}
            isConnectionLoading={isConnectionLoading}
          />
        );
      case "lead-integrations":
        return (
          <LeadIntegrationsContent
            required={required}
            handleConnectSocailMedia={handleConnectSocailMedia}
            connections={connections}
            isConnectionLoading={isConnectionLoading}
          />
        );
      default:
        return <div className="py-10 text-center">asdf</div>;
    }
  };
  const tabs = [
    {
      id: "social-integrations",
      label: "Social Integrations",
      icon: <Zap size={18} />,
    },
    {
      id: "mail-integrations",
      label: "Mail Integrations",
      icon: <Mail size={18} />,
    },
    {
      id: "lead-integrations",
      label: "Lead Integrations",
      icon: <WrapText size={18} />,
    },
    {
      id: "payment-integrations",
      label: "Payment Integrations",
      icon: <CreditCard size={18} />,
    },
  ];
  return (
    <>
      <CustomBreadCrumbs
        breadCrumbs={[
          ["Tools & Settings", "/agency"],
          ["Integrations", ""],
        ]}
      />
      {isFutureModalOpen && (
        <FutureIntegrations setIsModalOpen={setIsFutureModalOpen} />
      )}
      {isConnecting ? (
        <Connecting />
      ) : (
        <div className="dark:bg-[#191919] pb-7">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="md:flex">
                  <div className="w-full md:w-64 bg-white border-r border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-medium">Integrations</h2>
                      <p className="text-sm text-gray-500">
                        Manage your Integrations
                      </p>
                    </div>
                    <nav className="py-4">
                      {tabs
                        .filter((tab) => {
                          if (
                            tab.id === "payment-integrations" &&
                            user.role !== "agency"
                          )
                            return false;
                          return true;
                        })
                        .map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center px-6 py-3 text-sm ${
                              activeTab === tab.id
                                ? "bg-blue-50 text-blue-600 border-blue-600"
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
      )}
    </>
  );
};

export default Integrations;
