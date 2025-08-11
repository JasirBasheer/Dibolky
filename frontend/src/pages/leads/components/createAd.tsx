import React, { useState } from "react";

const CreateAdModal = () => {

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Create button clicked");
  };

  return (
    <>
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"/>

          <div className="fixed z-50 top-1/2 left-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Create Ad Set and Ad</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ad Section */}
              <div>
                <h3 className="font-medium mb-2">Ad Details</h3>

                <label
                  htmlFor="adName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ad Name
                </label>
                <input
                  id="adName"
                  name="adName"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="My Ad"
                />

                <label
                  htmlFor="adCreativeId"
                  className="block text-sm font-medium text-gray-700 mt-4"
                >
                  Ad Creative ID
                </label>
                <input
                  id="adCreativeId"
                  name="adCreativeId"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="1234567890"
                />

                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mt-4"
                >
                  Ad Status
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="PAUSED">Paused</option>
                  <option value="ACTIVE">Active</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 border-t border-gray-200 pt-4">
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

export default CreateAdModal;
