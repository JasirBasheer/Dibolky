import { SquarePen, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/types";
import { Button } from "@/components/ui/button";
import AddTestimonial from "./components/addTestimonial";
import { useState } from "react";
import { getAllTestimoinalsApi } from "@/services";
import { useQuery } from "@tanstack/react-query";

interface ITestimonial {
  _id: string;
  clientName: string;
  companyLogo?: string;
  testimonialText: string;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
  }).format(date);
}

function RegularTestimonial({ testimonial }: { testimonial: ITestimonial }) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <StarRating rating={testimonial.rating} />
        </div>

        <blockquote className="text-muted-foreground mb-6 flex-1 leading-relaxed">
          {testimonial.testimonialText}
        </blockquote>

        <div className="flex items-center gap-3 mt-auto">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={testimonial.companyLogo || "/placeholder.svg"}
              alt={testimonial.clientName}
            />
            <AvatarFallback className="text-sm font-semibold">
              {testimonial.clientName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">
              {testimonial.clientName}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            {formatDate(new Date(testimonial.createdAt))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const TestimonialsPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const [open, onOpenChange] = useState(false);

  const { data: testimonials, refetch } = useQuery({
    queryKey: ["get-testimonials"],
    queryFn: () => {
      return getAllTestimoinalsApi();
    },
    select: (data) => data?.data.testimonials,
    staleTime: 1000 * 60 * 60,
  });

  console.log(testimonials, "testimonas");

  return (
    <div className="min-h-screen bg-background">
      <CustomBreadCrumbs
        breadCrumbs={[
          ["Our Works", `/${user.role == "agency" ? "agency" : "client"}`],
          ["Portfolio", ""],
        ]}
      />
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials?.map((testimonial) => (
            <RegularTestimonial
              key={testimonial._id}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
      {user.role != "agency" && (
        <Button
          className="fixed bottom-5 right-5 shadow-lg"
          variant="outline"
          onClick={() => onOpenChange(true)}
        >
          <SquarePen className="w-4 h-4 mr-2" />
          Leave a review
        </Button>
      )}
      <AddTestimonial
        open={open}
        onOpenChange={onOpenChange}
        refetch={refetch}
      />
    </div>
  );
};
