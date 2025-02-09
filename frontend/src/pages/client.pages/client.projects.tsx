import React, { useState } from 'react';
import ServiceCard from '@/components/agency.components/service.card';
import { useSelector } from 'react-redux';

const ClientProjects = () => {
  const client = useSelector((state: any) => state.client);
  const [isServiceOpened, setIsServiceOpened] = useState(false)
  const [clickedService, setClickedService] = useState("")

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          SMM Projects
        </h1>
        <p className="text-gray-500 mt-2">
          Overview of your active marketing campaigns
        </p>
      </div>

      <div className="flex flex-wrap md:justify-start justify-center gap-6">
        {Object.keys(client.services).filter(item => ["SMM", "DM", "VIDEO"].includes(item))
          .map((item, index) => (
            <ServiceCard data={client.services[item]} setIsServiceOpened={setIsServiceOpened} setClickedService={setClickedService} item={item} />
          ))}
        {isServiceOpened &&
          <ServiceHistory details={client.services[clickedService]} setIsServiceOpened={setIsServiceOpened} />
        }
      </div>
    </div>
  );
};

export default ClientProjects;










import { CheckCheck, X } from "lucide-react";

const ServiceHistory = ({
  details,
  setIsServiceOpened
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: any;
  setIsServiceOpened: (value: boolean) => void;
}) => {
  if (!details) return null;
  const capitalizeKey = (key: string): string => {
    return key
      .split(/(?=[A-Z])|_/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={() => setIsServiceOpened(false)}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {details.serviceName} Details
          </h2>
          <button
            onClick={() => setIsServiceOpened(false)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="max-h-[32rem] overflow-y-auto pr-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Project Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(details.serviceDetails).map(([key, value]:[string,any]) => (
                    <div key={key}>
                      <label className="text-sm text-gray-500">{capitalizeKey(key)}</label>
                      <p className="font-medium">{key == "budget" ? "$":""} {value}</p>
                    </div>
                  ))}
                </div>

              </div>


              {(
                <div>
                  <h3 className="text-lg font-medium mb-3">Payment History</h3>

                  <div className="grid grid-cols-1 gap-4 ">
                    {[1, 2, 3, 4].map((item, index) => {
                      return (
                        <div key={index}>
                          <hr className="mb-1" />

                          <div className="flex  justify-between">
                            <div>

                              <label className="text-sm text-gray-500">Description</label>
                              <p className="font-medium">
                                {item}
                              </p>
                            </div>
                            <div className="">
                              <label className="text-sm text-gray-500">Amount</label>
                              <p className="font-medium">
                                $ {item}
                              </p>
                            </div>
                            {item && (
                              <div>
                                <label className="text-sm text-gray-500">Status</label>
                                <div className="w-full flex items-center justify-center">
                                  <CheckCheck className="w-4 text-green-700 text-center" />

                                </div>
                              </div>
                            )}
                          </div>
                          <hr className="mt-3 mb-1" />
                        </div>

                      )
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

