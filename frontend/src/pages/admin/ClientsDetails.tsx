import { IAdminClientData, Transactions } from "@/types/admin.types";
import { CheckCheck, X } from "lucide-react";
import { Key } from "react";

const AdminClientDetails = ({
  client,
  setIsClicked
}: {
  client: IAdminClientData;
  setIsClicked: (value: boolean) => void;
}) => {
  if (!client) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50  backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={() => setIsClicked(false)}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Client Details
          </h2>
          <button
            onClick={() => setIsClicked(false)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="max-h-[32rem] overflow-y-auto pr-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Name</label>
                    <p className="font-medium">{client.details?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{client.details.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="font-medium">{client.details.contactNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Industry</label>
                    <div className="flex items-center gap-2">
                      {client.details.industry}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Address</h3>
                <div className="space-y-2">

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Country</label>
                      <p className="font-medium">{client.details.address?.country}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">City</label>
                      <p className="font-medium">{client.details.address?.city}</p>
                    </div>

                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Additional Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Client Since</label>
                    <p className="font-medium">
                      {new Date(client.details.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Last Updated</label>
                    <p className="font-medium">
                      {new Date(client.details.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {client.transactions.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Payment History</h3>

                  <div className="grid grid-cols-1 gap-4 ">
                    {client.transactions.map((item: Transactions, index: Key | null | undefined) => {
                      return (
                        <div key={index}>
                          <hr className="mb-1" />

                          <div className="flex  justify-between">
                            <div>

                              <label className="text-sm text-gray-500">Description</label>
                              <p className="font-medium">
                                {item.description}
                              </p>
                            </div>
                            <div className="">
                              <label className="text-sm text-gray-500">Amount</label>
                              <p className="font-medium">
                                $ {item.amount}
                              </p>
                            </div>
                            {item.amount && (
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

export default AdminClientDetails;