import React, { useState } from "react";

const CreateCampaign = () => {

  return (

        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          ></div>

          {/* Modal */}
          <div className="fixed z-50 top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Create Campaign</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Call your API here
                alert("Create button clicked");
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="campaignName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Campaign Name
                </label>
                <input
                  id="campaignName"
                  name="campaignName"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="objective"
                  className="block text-sm font-medium text-gray-700"
                >
                  Objective
                </label>
                <select
                  id="objective"
                  name="objective"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="">Select objective</option>
                  <option value="LINK_CLICKS">Link Clicks</option>
                  <option value="CONVERSIONS">Conversions</option>
                  <option value="BRAND_AWARENESS">Brand Awareness</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </>
  );
};

export default CreateCampaign;
