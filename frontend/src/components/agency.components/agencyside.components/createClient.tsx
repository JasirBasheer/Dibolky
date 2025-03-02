import React, { useState } from "react";
import axios from "../../../utils/axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useSelector } from "react-redux";
import { X } from "lucide-react";
import { SERVICES } from "../../../utils/services";
import { RootState } from "@/types/common.types";

const CreateClient = () => {
  const [name, setName] = useState("jasir");
  const [industry, setIndustry] = useState("jas");
  const [email, setEmail] = useState("jasirbinbasheerpp@gmail.com");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const orgId = useSelector((state: RootState) => state?.agency?.orgId);

  const [servicesPreview, setServicesPreview] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<{
    [key: string]: {
      serviceName: string;
      serviceDetails: { [key: string]: string | number };
    };
  }>({});

  const handleServiceInputChange = (name: string, value: string) => {
    if (!selectedService) return;
    setSelectedServices((prev) => ({
      ...prev,
      [selectedService]: {
        serviceName: SERVICES[selectedService].label,
        serviceDetails: {
          ...(prev[selectedService]?.serviceDetails || {}),
          [name]: value,
        },
      },
    }));
  };


  const handleAddService = () => {
    if (!selectedService) return;
    const newServiceLabel = SERVICES[selectedService].label;
    setServicesPreview((prev) => {
      if (prev.includes(newServiceLabel)) {
        return prev.map((service) =>
          service === newServiceLabel ? newServiceLabel : service
        );
      }
      return [...prev, newServiceLabel];
    });
    
    setSelectedService(null);
  };

  const handleRemove = (index: number) => {
    const serviceLabel = servicesPreview[index];
    const serviceKey = Object.keys(SERVICES).find((key) => SERVICES[key].label === serviceLabel);

    if (serviceKey) {
      setServicesPreview((prev) => prev.filter((_, i) => i !== index));
      setSelectedServices((prev) => {
        const newServices = { ...prev };
        delete newServices[serviceKey];
        return newServices;
      });
    }
  };

  const handleSubmit = async () => {
    try {
      console.log(selectedServices)
      setIsLoading(true);
      const response = await axios.post("/api/agency/client", {
        orgId,
        name,
        industry,
        email,
        services: selectedServices,
        menu:servicesPreview
      });

      if (response.status === 201) {
        message.success("Client created successfully");
        navigate("/agency/clients");
        return;
      }
    } catch (error:any) {
      console.log(error);
      message.error(error.response?.data?.error || "Failed to create client");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="w-[50rem] p-6 bg-white shadow-lg rounded-md mb-24 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Create Client</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
              value={name}
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <input
              onChange={(e) => setIndustry(e.target.value)}
              type="text"
              id="industry"
              name="industry"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the industry"
              value={industry}
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              value={email}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Selected Services</label>
            <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm min-h-[5rem]">
              <div className="flex flex-wrap gap-2">
                {servicesPreview.length > 0 ? (
                  servicesPreview.map((service, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-200"
                    >
                      <span className="text-sm font-medium text-gray-700">{service}</span>
                      <button
                        onClick={() => handleRemove(index)}
                        className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-gray-200"
                      >
                        <X className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-sm font-medium text-gray-700">NO SERVICE SELECTED</div>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
            <select
              onChange={(e) => setSelectedService(e.target.value)}
              value={selectedService || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>
                Select a service
              </option>
              {Object.keys(SERVICES).map((key) => (
                <option key={key} value={key}>
                  {SERVICES[key].label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1 md:mt-[1.4rem]">
            <button
              onClick={handleSubmit}
              type="button"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              {isLoading ? "Creating..." : "Create Client"}
            </button>
          </div>
        </div>

        {selectedService && (
          <ServiceModal
            selectedService={selectedService}
            onAdd={handleAddService}
            onInputChange={handleServiceInputChange}
            onClose={() => setSelectedService(null)}
          />
        )}
      </div>
    </div>
  );
};
const ServiceModal = ({
  selectedService,
  onAdd,
  onInputChange,
  onClose,
}: {
  selectedService: string;
  onAdd: () => void;
  onInputChange: (name: string, value: string) => void;
  onClose: () => void;
}) => {
  if (!SERVICES[selectedService]) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative col-span-2 p-4 bg-gray-50 rounded-lg w-[30rem]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        <div className="grid grid-cols-2 gap-4">
          {SERVICES[selectedService].inputs.map((item:any) => (
            <div key={item.name} className="col-span-2">
              <label htmlFor={item.name} className="block text-sm font-medium text-gray-700 mb-1">
                {item.label}
              </label>
              {item.type === "select" ? (
                <select
                  id={item.name}
                  name={item.name}
                  onChange={(e) => onInputChange(item.name, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                >
                  <option value="">{item.placeholder}</option>
                  {item.options?.map((option: string) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={item.type}
                  id={item.name}
                  name={item.name}
                  onChange={(e) => onInputChange(item.name, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                  placeholder={item.placeholder}
                />
              )}
            </div>
          ))}
          <div className="col-span-2 flex justify-end items-center">
            <button
              onClick={onAdd}
              className="w-1/2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Add Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CreateClient;
