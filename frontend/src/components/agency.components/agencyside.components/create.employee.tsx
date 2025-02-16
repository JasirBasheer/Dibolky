import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from '@/utils/axios';
import { message } from 'antd';

interface Department {
  department: string;
  _id: string;
}

interface EmployeeFormData {
  name: string;
  email: string;
  departmentId: string;
  role: string;
}

interface CreateEmployeeProps {
  setIsAddEmployeeClicked: Dispatch<SetStateAction<boolean>>;
}

const ROLES = ['employee', 'lead', 'manager'];

const CreateEmployee: React.FC<CreateEmployeeProps> = ({ setIsAddEmployeeClicked }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    email: "",
    departmentId: "",
    role: "employee"
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchDepartments = async () => {
    try {
      const res = await axios('/api/entities/get-departments');
      if(res)setDepartments(res.data.departments);

    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (value: string, name: keyof EmployeeFormData): void => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateEmployee = async () => {
    try {
      setIsLoading(true);
      
      if (!formData.name || !formData.email || !formData.departmentId || !formData.role) {
        throw new Error('Please fill in all required fields');
      }

      const response = await axios.post('/api/entities/create-employee', formData);

      if (response.status == 201) {
        message.success("New Employee created");
      }

      setIsAddEmployeeClicked(false);
    } catch (error) {
      message.error(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={() => setIsAddEmployeeClicked(false)}
    >
      <Card 
        className="w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Create Employee</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => setIsAddEmployeeClicked(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                placeholder="Enter employee name"
                value={formData.name}
                onChange={(e) => handleChange(e.target.value, 'name')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleChange(e.target.value, 'email')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select 
                value={formData.departmentId}
                onValueChange={(value) => handleChange(value, 'departmentId')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {
                    departments?.map((dept) => (
                      <SelectItem key={dept._id} value={dept._id}>
                        {dept.department}
                      </SelectItem>
                    ))
                }
                  {}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={formData.role}
                onValueChange={(value) => handleChange(value, 'role')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={() => setIsAddEmployeeClicked(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateEmployee}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Employee'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEmployee;