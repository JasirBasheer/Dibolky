import React, { useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useSelector } from "react-redux";

const CreateClient = () => {
  const [name, setName] = useState("jasir")
  const [industry, setIndustry] = useState("jas")
  const [email, setEmail] = useState("jasirbinbasheerpp@gmail.com")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const orgId = useSelector((state: any) => state?.agency?.orgId);

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post('/api/agency/client', { orgId, name, industry, email })
      setIsLoading(false)

      console.log(response)
      if (response.status == 201) {
        navigate('/agency/clients')
        message.success("Client created successfully")
        return
      }

    } catch (error: any) {
      setIsLoading(false)
      message.error(error.response.data.message)

    }
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="w-[50rem] p-6 bg-white shadow-lg rounded-md mb-24">
        <h2 className="text-xl font-bold mb-4 text-gray-800 ">Create Client</h2>

        <div className="grid grid-cols-2 gap-4" >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label
              htmlFor="industry"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Industry
            </label>
            <input
              onChange={(e) => setIndustry(e.target.value)}
              type="text"
              id="industry"
              name="industry"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the industry"
            />
          </div>

          <div className="col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="col-span-2">
            <button
              onClick={handleSubmit}
              type="button"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-offset-2"
            >
              {isLoading ? 'Creating...' : 'Create Client'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClient;
