import FutureIntegrations from "@/components/common/futureIntegrations";
import PaymentIntegrationModal from "@/components/common/integrate-payment.modal";
import { getPaymentIntegrationsStatus } from "@/services/agency/get.services";
import { useQuery } from "@tanstack/react-query";
import { Cable } from "lucide-react";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";


export const PaymentIntegrationsContent = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFutureIntegrationOpen, setIsFutureIntegrationOpen] = useState<boolean>(false);
  const [paymentIntegrationTutorialUrl, setPaymentIntegrationTutorialUrl] = useState<string>("");
  const [currentPaymentProvider, setCurrentPaymentProvider] = useState<string>("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-payment-integration-status"],
    queryFn: () => {
      return getPaymentIntegrationsStatus();
    },
    select: (data) => data?.data.paymentIntegrationStatus,
    staleTime: 1000 * 60 * 60,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Payment Gateways</h3>
      </div>

      <div
        className={`flex items-center justify-between p-4 border  bg-grey-200 rounded`}
      >
        <div className="flex items-center  space-x-4">
          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl_awAhWbcBFYxdA0BCF6Y-dZP_0nbXCnRrEuCyf_5Tsoy88XrQ5PbSU5_00ygMQ5Az_s&usqp=CAU"
              className="w-6 h-6"
            />
          </div>
          <div>
            <h4 className="font-medium">Razorpay</h4>
            {data && data?.isRazorpayIntegrated ? (
              <p className="text-sm text-green-600">Integrated</p>
            ) : (
              <p className="text-sm text-gray-500">Not integrated</p>
            )}
          </div>
        </div>
        {isLoading ? (
          <>
            <Skeleton height={25} width={90} />
          </>
        ) : (
          <button
            className={`px-3 py-1.5 text-sm rounded flex items-center space-x-1 bg-black text-white transition`}
          >
            <div
              className="w-full flex items-center justify-between gap-2"
              onClick={() => {
                setPaymentIntegrationTutorialUrl(
                  "https://www.youtube.com/embed/aLLI9UwNMl0?si=JQg5Q1RLNbyL1G8T"
                );
                setCurrentPaymentProvider("razorpay");
                setIsModalOpen(true);
              }}
            >
              <span>
                {data.isRazorpayIntegrated
                  ? "Re Integrate"
                  : "Integrate"}
              </span>
              <Cable size={14} />
            </div>
          </button>
        )}
      </div>

      <div
        className={`flex items-center justify-between p-4 border  bg-grey-200 rounded`}
      >
        <div className="flex items-center  space-x-4">
          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPlXQfoxEWFHosgkF9qA78PE_wQzqHKRGthXKVeS1hRBe27oqxJ8lCbz34LRPKaCvT3Bc&usqp=CAU"
              className="w-6 h-6"
            />
          </div>
          <div>
            <h4 className="font-medium">Stripe</h4>
              <p className="text-sm text-gray-500">Not integrated</p>
            
          </div>
        </div>
        {isFutureIntegrationOpen && <FutureIntegrations setIsModalOpen={setIsFutureIntegrationOpen}/>}

        {isLoading ? (
          <>
            <Skeleton height={25} width={90} />
          </>
        ) : (
          <button
            className={`px-3 py-1.5 text-sm rounded flex items-center space-x-1 bg-black text-white transition`}>
            <div
              className="w-full flex items-center justify-between gap-2"
              onClick={() => {
                setIsFutureIntegrationOpen(true)
              }}
            >
              <span>
                Integrate
              </span>
              <Cable size={14} />
            </div>
          </button>
        )}
      </div>
      <PaymentIntegrationModal
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        tutorialUrl={paymentIntegrationTutorialUrl}
        provider={currentPaymentProvider}
        refetch={refetch}
      />
    </div>
  );
};

// name ,tast, cripy and will you reconment it