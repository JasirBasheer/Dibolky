import { Dispatch, SetStateAction, useState } from 'react';
import { X, Plus, FolderKanban, Users } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { message } from 'antd';
import { updatePlanApi } from '@/services/admin/post.services';
import { IPlan } from '@/types/admin.types';

interface EditPlanProps {
  onClose: () => void;
  plan: IPlan;
}

const PRESET_MENUS = ["Dashboard", "Our Work", "Client Management", "Content & Projects",
  "Communications", "Invoice Management", "Billing & Plans", "Tools & Settings"];

const EditPlan = ({ onClose, plan }: EditPlanProps) => {
  const [formData, setFormData] = useState({
    name: plan.name,
    price: plan.price,
    type: plan.type,
    description: plan.description,
    billingCycle: plan.billingCycle,
    maxProjects: plan.maxProjects || 0,
    maxClients: plan.maxClients || 0
  });

  const [features, setFeatures] = useState(plan.features || []);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [newFeature, setNewFeature] = useState('');

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const toggleMenu = (menuLabel: string) => {
    if (selectedMenus.includes(menuLabel)) {
      setSelectedMenus(selectedMenus.filter(menu => menu !== menuLabel));
    } else {
      setSelectedMenus([...selectedMenus, menuLabel]);
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleEditPlan = async () => {
    try {
      if (features.length === 0 || selectedMenus.length === 0) {
        message.warning("Enter valid values for your updated plan");
        return;
      }
      
      const updatedPlan = {
        ...formData,
        features,
        ...(selectedMenus.length > 0 && { menu: selectedMenus }),
      };


      const res = await updatePlanApi(plan._id as string, updatedPlan);

      if (res.status === 200) {
        message.success("Plan successfully updated");
        onClose();
      }
    } catch (error: unknown) {
      message.error(error instanceof Error ? error.message : 'Unexpected error occurred while updating plan');
    }
  };

  const handleChange = (value: string | number, name: string): void => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div
      className="fixed inset-[-3rem] bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={() => onClose()}
    >
      <Card className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className=" p-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold sm:ml-0 ml-5 ">Edit Plan</h2>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => onClose()}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <CardContent className="p-3">
          <div className="max-h-[29rem] overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 pr-4 space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4 ml-1">Basic Information</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 ml-1">
                    <Label htmlFor="title">Name</Label>
                    <Input
                      id="title"
                      value={formData.name}
                      onChange={(e) => handleChange(e.target.value, 'name')}
                    />
                  </div>
                  <div className="space-y-2 ml-1">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      type="number"
                      disabled={formData.type === 'trial'}
                      onChange={(e) => handleChange(Number(e.target.value), 'price')}
                    />
                  </div>
                </div>

                <div className="space-y-2 ml-1">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange(e.target.value, 'description')}
                    className="h-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FolderKanban className="h-4 w-4" />
                    Total Projects
                  </Label>
                  <Input
                    type="number"
                    value={formData.maxProjects}
                    onChange={(e) => handleChange(Number(e.target.value), 'maxProjects')}
                    placeholder="Enter project count"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Clients
                  </Label>
                  <Input
                    type="number"
                    value={formData.maxClients}
                    onChange={(e) => handleChange(Number(e.target.value), 'maxClients')}
                    placeholder="Enter client count"
                  />
                </div>

                <div>
                  <Label className="text-sm ml-1">Validity Period</Label>
                  <RadioGroup value={formData.billingCycle} className="flex gap-4 mt-4 ml-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="monthly"
                        id="month"
                        onClick={() => handleChange("monthly", "billingCycle")}
                        defaultChecked={formData.billingCycle === 'monthly'}
                      />
                      <Label htmlFor="month">Monthly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="yearly"
                        id="year"
                        onClick={() => handleChange("yearly", "billingCycle")}
                      />
                      <Label htmlFor="year">Yearly</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Features & Menu</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4 ml-1">
                  <Label>Features</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature"
                      onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    />
                    <Button onClick={addFeature} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="py-1 px-3">
                        {feature}
                        <button
                          onClick={() => removeFeature(index)}
                          className="ml-2 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Available Menus</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_MENUS.map((menu) => (
                      <Button
                        key={menu}
                        variant={selectedMenus.includes(menu) ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => toggleMenu(menu)}
                      >
                        {menu}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
            <Button variant="outline" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button
              onClick={handleEditPlan}
              disabled={selectedMenus.length === 0}
            >
              Update Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPlan;
