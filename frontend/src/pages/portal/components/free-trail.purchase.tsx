import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { checkIsMailExistsApi } from '@/services/common/post.services'
import { getPlanDetailsApi } from '@/services/common/get.services'
import { useQuery } from '@tanstack/react-query'
import { validateField } from '@/validation/portalValidation'
import { createTrialAgencyApi } from '@/services/portal/post.services'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'

interface FreeTrialPurchaseProps {
  planId: string;
  onClose: () => void;
}

const FreeTrialPurchase = ({ planId, onClose }: FreeTrialPurchaseProps) => {
  const navigate = useNavigate()

  const { data: plan } = useQuery({
    queryKey: ["get-trail-plan-details"],
    queryFn: () => {
      return getPlanDetailsApi(planId)
    },
    select: (data) => data?.data.plan,
  })


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    organizationName: '',
    city: '',
    industry: '',
    country: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };



  const validateMail = async (mail: string): Promise<boolean> => {
    console.log(plan)
    const response = await checkIsMailExistsApi(`?mail=${mail}`)
    return response.data.isExists
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    for(const key in formData){
      const error =  validateField(key,formData[key as keyof typeof formData])
      if(error !=""){
        toast.error(error)
        return 
      }
    }

    try {      
      const isMailExists = await validateMail(formData.email)
      if(isMailExists){
      toast.error("Entered mail is already exists in the main database , try with new mail.")
      return 
      }

      const details = {
        organizationName: formData.organizationName,
        name: formData.firstName + ' ' + formData.lastName,
        email: formData.email,
        address: {
            city: formData.city,
            country: formData.country
        },
        website: "",
        password: formData.password,
        contactNumber: formData.phone,
        logo: "",
        validity:1,
        industry: formData.industry,
        planId:plan._id,
        description:plan.name + " "+"Purchased",
    }

      const res = await createTrialAgencyApi(details)
      if (res.status == 201) {
          setTimeout(() => {
              message.success('Agnecy successfully created')
          }, 100)

          setTimeout(() => {
              message.success('Login to continue')
              navigate('/agency/login')
          }, 500)
      }
    


      // onClose();
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <Dialog open={!!planId} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Free Trial Registration</DialogTitle>
          <DialogDescription>
            Fill out the form below to start your free trial
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='firstName'>First Name</Label>
              <Input
                type='text'
                id='firstName'
                name='firstName'
                value={formData.firstName}
                onChange={handleChange}
                placeholder='Enter first name'
                required
              />
            </div>
            <div>
              <Label htmlFor='lastName'>Last Name</Label>
              <Input
                type='text'
                id='lastName'
                name='lastName'
                value={formData.lastName}
                onChange={handleChange}
                placeholder='Enter last name'
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor='email'>Email</Label>
            <Input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter email address'
              required
            />
          </div>

          <div>
            <Label htmlFor='password'>Password</Label>
            <Input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Create a strong password'
              required
            />
          </div>

          <div>
            <Label htmlFor='phone'>Phone Number</Label>
            <Input
              type='tel'
              id='phone'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              placeholder='Enter phone number'
              required
            />
          </div>

          <div>
            <Label htmlFor='organizationName'>Organization Name</Label>
            <Input
              type='text'
              id='organizationName'
              name='organizationName'
              value={formData.organizationName}
              onChange={handleChange}
              placeholder='Enter organization name'
              required
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='city'>City</Label>
              <Input
                type='text'
                id='city'
                name='city'
                value={formData.city}
                onChange={handleChange}
                placeholder='Enter city'
                required
              />
            </div>
            <div>
              <Label htmlFor='country'>Country</Label>
              <Input
                type='text'
                id='country'
                name='country'
                value={formData.country}
                onChange={handleChange}
                placeholder='Enter country'
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor='industry'>Industry</Label>
            <Input
              type='text'
              id='industry'
              name='industry'
              value={formData.industry}
              onChange={handleChange}
              placeholder='Enter your industry'
              required
            />
          </div>

          <div className='flex justify-end space-x-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onClose()}
            >
              Cancel
            </Button>
            <Button type='submit'>
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default FreeTrialPurchase