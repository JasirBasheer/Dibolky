import { Loader2 } from "lucide-react";
import React from "react";

const Connecting = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      <div className="relative bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-sm w-full transform animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-blue-100 animate-pulse" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Connecting...
            </h3>
            <p className="text-sm text-gray-500">
              Please wait while we establish the connection
            </p>
          </div>

          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connecting;
