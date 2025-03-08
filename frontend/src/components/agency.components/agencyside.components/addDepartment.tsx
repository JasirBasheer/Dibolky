import React, { Dispatch, SetStateAction, useState } from 'react';
import { X } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const PRESET_PERMISSION = ['smm', 'crm', 'accounting', 'marketing'];

interface AddDepartmentProps {
  setIsAddDepartmentClicked: Dispatch<SetStateAction<boolean>>;
}

const AddDepartment = ({ setIsAddDepartmentClicked }: AddDepartmentProps) => {
  const [permissions, setPermissions] = useState<string[]>([]);


  const toggleMenu = (permission: string) => {
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter(item => item !== permission));
    } else {
      setPermissions([...permissions, permission]);
    }
  };




  return (
    <div className="fixed inset-[-3rem] bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 "
      onClick={() => setIsAddDepartmentClicked(false)}
    >
      <Card className="w-full max-w-3xl "
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" p-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold sm:ml-0 ml-5 ">Create Department</h2>
          <Button variant="ghost" size="icon" className="rounded-full"
            onClick={() => setIsAddDepartmentClicked(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <CardContent className="p-3">
          <div className="max-h-[29rem] overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 pr-4 space-y-8 [&::-webkit-scrollbar]:w-2 
          [&::-webkit-scrollbar-track] [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb] [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb:hover]:bg-gray-400">
            <div>
              <div className="space-y-6">

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 ml-1">
                    <Label htmlFor="title">Department Name</Label>
                    <Input id="title" placeholder="Enter plan title" />
                  </div>
                </div>

              </div>
            </div>

            <div>
              <Label htmlFor="title">Permissions</Label>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_PERMISSION.map((permission) => (
                      <Button
                        key={permission}
                        variant={permissions.some(item => item === permission) ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => toggleMenu(permission)}
                      >
                        {permission}
                      </Button>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsAddDepartmentClicked(false)}
            >Cancel</Button>
            <Button
              disabled={permissions.length === 0}
            >
              Create Department
            </Button>

          </div>
        </CardContent>
      </Card>
    </div>

  );
};

export default AddDepartment;