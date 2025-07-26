import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createTestimonailsApi } from '@/services/client/post.services'
import { RootState } from '@/types'
import { UseQueryResult } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

export interface ITestimonial {
  clientName: string
  companyLogo?: string
  testimonialText: string
  rating: number
}

interface AddTestimonialProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: UseQueryResult["refetch"];
}

const AddTestimonial: React.FC<AddTestimonialProps> = ({ open, onOpenChange, refetch }) => {
  const user = useSelector((state:RootState)=> state.user)
  const [formData, setFormData] = useState<ITestimonial>({
    clientName: "",
    testimonialText: "",
    rating: 1,
  });  
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStarClick = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      formData.clientName = user.name
      const response = await createTestimonailsApi(formData);

      if (response.status === 200) {
        toast.success("Success: Testimonial created successfully");
        setFormData({ clientName: "", testimonialText: "", rating: 1 });
        onOpenChange(false);
        refetch();
      } else {
        throw new Error("Failed to save testimonial");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error: Failed to create testimonial");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="testimonialText">Review</Label>
            <Textarea
              id="testimonialText"
              name="testimonialText"
              value={formData.testimonialText}
              onChange={handleInputChange}
              required
              placeholder="Enter your thoughts about us."
            />
          </div>
          <div>
            <Label>Rating</Label>
            <div className="flex space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className={`text-2xl ${
                    star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                  } focus:outline-none`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={isUploading}>
            {isUploading ? "Submitting..." : "Submit Testimonial"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTestimonial;