import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IntegratePaymentApi } from '@/services/agency/post.services';
import { message } from 'antd';
import { QueryObserverResult } from '@tanstack/react-query';

const PaymentIntegrationModal = ({
  isOpen,
  onClose,
  tutorialUrl,
  provider,
  refetch
}: {
  isOpen: boolean;
  onClose: (value: boolean) => void;
  tutorialUrl: string;
  provider: string;
  refetch: () => Promise<QueryObserverResult<void>>;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    key1: '',
    key2: '',
    webhookUrl: ''
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const response = await IntegratePaymentApi(provider, formData)
      if(response){ 
      message.success(`${response.data.provider} successfully integrated`)
      refetch()
      }
      onClose(false);
    } catch (error) {
      console.error("Integration failed", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {provider === 'razorpay' ? 'Integrate Razorpay' : 'Integrate Stripe'}
          </DialogTitle>
        </DialogHeader>

        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
              {tutorialUrl ? (
                <iframe
                  src={tutorialUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="w-full h-full"
                  allowFullScreen
                  title={`${provider} integration tutorial`}
                />
              ) : (
                <div className="text-center p-6">
                  <p className="mb-2 text-gray-600">Tutorial Video</p>
                  <p className="text-sm text-gray-500">
                    This video explains how to set up your {provider} integration
                  </p>
                </div>
              )}
            </div>
            <div className="text-sm">
              <p>Follow these steps to integrate {provider}:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Create an account on the {provider} website</li>
                <li>Go to your dashboard and find API keys</li>
                <li>Copy your access key and secret key</li>
                <li>Enter these keys in the next step</li>
              </ol>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="key1">{provider == "stripe" ? "Publish key" : "Secret id"}</Label>
                <Input
                  id="key1"
                  name="key1"
                  type="password"
                  placeholder={`Enter your ${provider == "stripe" ? "publish key" : "secret id"}`}
                  value={formData.key1}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key2">Secret key</Label>
                <Input
                  id="key2"
                  name="key2"
                  type="password"
                  placeholder="Enter your secret key"
                  value={formData.key2}
                  onChange={handleFormChange}
                />
              </div>
              {provider == "stripe" &&
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook url</Label>
                  <Input
                    id="webhookUrl"
                    name="webhookUrl"
                    type="text"
                    placeholder="Enter your webhook url"
                    value={formData.webhookUrl}
                    onChange={handleFormChange}
                  />
                </div>
              }
            </div>
            <p className="text-sm text-gray-500">
              Your keys are encrypted and stored securely. We never share your credentials with third parties.
            </p>
          </div>
        )}

        <DialogFooter className="flex justify-between sm:justify-between">
          {currentStep === 1 ? (
            <Button variant="outline" onClick={() => onClose(false)}>
              Cancel
            </Button>
          ) : (
            <Button variant="outline" onClick={handlePrevStep}>
              Back
            </Button>
          )}

          {currentStep === 1 ? (
            <Button onClick={handleNextStep}>
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!formData.key1 || !formData.key2 || (provider == "stripe" && !formData.webhookUrl)}
            >
              Integrate
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentIntegrationModal;