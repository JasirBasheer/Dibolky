"use client"

import { Wrench, X } from "lucide-react"

const FutureIntegrations = ({
  setIsModalOpen,
}: {
  setIsModalOpen: (value: boolean) => void
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsModalOpen(false)}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-100">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-10 h-10 text-indigo-500" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Future integration</h2>
            <p className="text-gray-600 leading-relaxed">
              {"feature integration, Stay tuned for updates!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FutureIntegrations