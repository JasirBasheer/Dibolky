import React, { Dispatch, SetStateAction, useState } from 'react';
import { X, Plus, FolderKanban } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { message } from 'antd';
import { createPlanApi } from '@/services/admin/post.services';
import { memo } from 'react';

const PRESET_MENUS = ['SMM', 'CRM', 'ACCOUNTING', 'MARKETING'];

interface AddPlanProps {
  setIsAddPlan: Dispatch<SetStateAction<boolean>>;
}

const AddPlan = ({ setIsAddPlan }: AddPlanProps) => {
  const [formData, setFormData] = useState({
    planName: "", price: 0, description: "",
    validity: "monthly", planType: "agency",
    totalProjects: 0, totalManagers: 0
  })

  const [features, setFeatures] = useState([]);
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


  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };


  const handleCreatePlan = async () => {
    try {
      if (features.length == 0 || selectedMenus.length == 0) {
        message.warning("Enter valid values for your new plan")
        return
      }
      const details = {
        ...formData,
        features,
        menu: selectedMenus
      }

      const res = await createPlanApi(details)
      if (res.status == 200) {
        message.success("Plan successfully created")
        setIsAddPlan(false)
      }
    } catch (error: unknown) {
      message.error(error instanceof Error ? error.message : 'Unexpected error occurred while creating plan');
    }
  }

  const handleChange = (
    value: string | number, name: string): void => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  return (
    <div className="fixed inset-[-3rem] bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 "
      onClick={() => setIsAddPlan(false)}
    >
      <Card className="w-full max-w-3xl "
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" p-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold sm:ml-0 ml-5 ">Create Plan</h2>
          <Button variant="ghost" size="icon" className="rounded-full"
            onClick={() => setIsAddPlan(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <CardContent className="p-3">
          <div className="max-h-[29rem] overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 pr-4 space-y-8 [&::-webkit-scrollbar]:w-2 
          [&::-webkit-scrollbar-track] [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb] [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb:hover]:bg-gray-400">
            <div>
              <h3 className="text-lg font-medium mb-4 ml-1">Basic Information</h3>
              <div className="space-y-6">
                <div>
                  <Label className="text-sm ml-1">Entity Type</Label>
                  <RadioGroup defaultValue="agency" className="flex gap-4 mt-3 ml-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="agency" id="agency" onClick={() => handleChange("agency", "planType")} defaultChecked />
                      <Label htmlFor="agency">Agency</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Influencer" id="influencer" onClick={() => handleChange("influencer", "planType")} />
                      <Label htmlFor="influencer">Influencer</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 ml-1">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Enter plan title" onChange={(e) => handleChange(e.target.value, 'planName')} />
                  </div>
                  <div className="space-y-2 ml-1">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" placeholder="Enter price" type="number" onChange={(e) => handleChange(Number(e.target.value), 'price')} />
                  </div>
                </div>

                <div className="space-y-2 ml-1">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter plan description"
                    className="h-24"
                    onChange={(e) => handleChange(e.target.value, 'description')}
                  />
                </div>

                <div>
                  <Label className="text-sm ml-1">Validity Period</Label>
                  <RadioGroup defaultValue="month" className="flex gap-4 mt-4 ml-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="month" id="month" onClick={() => handleChange("Monthly", "validity")} defaultChecked />
                      <Label htmlFor="month">Monthly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="year" id="year" onClick={() => handleChange("Yearly", "validity")} />
                      <Label htmlFor="year">Yearly</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 ml-1">
              {formData.planType === 'agency' && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FolderKanban className="h-4 w-4" />
                    Total Projects
                  </Label>
                  <Input
                    type="number"
                    onChange={(e) => handleChange(Number(e.target.value), 'totalProjects')}
                    placeholder="Enter project count"
                  />
                </div>
              )}
              {formData.planType === 'influencer' && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FolderKanban className="h-4 w-4" />
                    Total Managers
                  </Label>
                  <Input
                    type="number"
                    onChange={(e) => handleChange(Number(e.target.value), 'totalManagers')}
                    placeholder="Enter project count"
                  />
                </div>
              )}

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
                        variant={selectedMenus.some(m => m === menu) ? "default" : "outline"}
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
            <Button variant="outline" onClick={() => setIsAddPlan(false)}
            >Cancel</Button>
            <Button
              onClick={handleCreatePlan}
              disabled={selectedMenus.length === 0}
            >
              Create Plan
            </Button>

          </div>
        </CardContent>
      </Card>
    </div>

  );
};

export default memo(AddPlan);