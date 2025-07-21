interface Testimonial {
    quote: string;
    name: string;
    username: string;
    image: string;
  }
  
  import { Card } from "@/components/ui/card";
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
  } from "@/components/ui/carousel";
  import Autoplay from "embla-carousel-autoplay";
  
  const testimonials: Testimonial[] = [
    {
      quote: "Dibolky's content feed is brilliant! I can customize my feed perfectly, and the algorithm always suggests relevant articles in my field.",
      name: "Maya Patel",
      username: "@maya_writes",
      image: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp"
    },
    {
      quote: "As a content creator, Dibolky gives me incredible visibility. My readership has grown 300% since I started publishing here!",
      name: "Arjun Singh",
      username: "@arjun_content",
      image: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp"
    },
    {
      quote: "The curation on Dibolky's feed is unmatched. I discover quality content daily without the noise you find on other platforms.",
      name: "Priya Sharma",
      username: "@priyareads",
      image: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp"
    },
    {
      quote: "Dibolky transformed how I consume industry news. The personalized feed and reading lists help me stay updated effortlessly.",
      name: "Rahul Verma",
      username: "@rahul_tech",
      image: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp"
    },
    {
      quote: "Publishing on Dibolky connected me with readers I never would have reached otherwise. The analytics help me create better content.",
      name: "Kavita Krishnan",
      username: "@kavita_creates",
      image: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp"
    },
    {
      quote: "The feed's categorization system is perfect! I can switch between professional content and casual reading with just one click.",
      name: "Varun Mehra",
      username: "@varun_reads",
      image: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp"
    },
    {
      quote: "Dibolky's recommendation engine understands my interests better than I do! I've discovered amazing creators I now follow religiously.",
      name: "Anjali Desai",
      username: "@anjali_d",
      image: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp"
    },
    {
      quote: "As someone who publishes weekly, Dibolky's scheduling tools and reader engagement metrics have been revolutionary for my workflow.",
      name: "Karan Malhotra",
      username: "@karan_writes",
      image: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp"
    }
  ];
  
  const TestimonialsSection: React.FC = () => {
    const topRowTestimonials = testimonials.filter((_, i) => i % 2 === 0);
    const bottomRowTestimonials = testimonials.filter((_, i) => i % 2 === 1);
  
    const extendedTopRow: Testimonial[] = [...topRowTestimonials, ...topRowTestimonials, ...topRowTestimonials];
    const extendedBottomRow: Testimonial[] = [...bottomRowTestimonials, ...bottomRowTestimonials, ...bottomRowTestimonials];
  
    const pluginTop = Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    });
  
    const pluginBottom = Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    });
  
    return (
      <section className="py-12 relative overflow-hidden px-6 md:px-10 lg:px-20 mt-16" id="reviews">
      <h2 className="text-2xl font-bold font-lazare text-center mb-8">Testimonials</h2>
      <div className="max-w-6xl mx-auto">
        <div className="space-y-4">
          {/* Top Row Carousel */}
          <Carousel 
            className="w-full overflow-visible"
            plugins={[pluginTop]}
            opts={{
              align: "start",
              loop: true,
              skipSnaps: false,
              containScroll: "trimSnaps"
            }}
          >
            <CarouselContent className="-ml-2">
              {extendedTopRow.map((testimonial: Testimonial, index: number) => (
                <CarouselItem 
                  key={`top-${index}`} 
                  className="pl-2 basis-full sm:basis-1/2 md:basis-1/3 "
                >
                  <Card className="dark:bg-[#212630] p-4 rounded-lg dark:text-white h-full transform transition-all duration-300 hover:scale-102">
                    <p className="mb-3 text-xs">{testimonial.quote}</p>
                    <div className="flex items-center gap-2">
                      <img
                        src={testimonial.image}
                        className="rounded-full w-8 h-8 object-cover"
                        />
                      <div>
                        <h4 className="font-semibold text-xs">{testimonial.name}</h4>
                        <p className="text-xs text-gray-400">{testimonial.username}</p>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
    
          {/* Bottom Row Carousel */}
          <Carousel 
            className="w-full overflow-visible"
            plugins={[pluginBottom]}
            opts={{
              align: "center",
              loop: true,
              skipSnaps: false,
              containScroll: "trimSnaps"
            }}
          >
            <CarouselContent className="-ml-2">
              {extendedBottomRow.map((testimonial: Testimonial, index: number) => (
                <CarouselItem 
                  key={`bottom-${index}`} 
                  className="pl-2 basis-full sm:basis-1/2 md:basis-1/3"
                >
                  <Card className="dark:bg-[#212630] p-4 rounded-lg dark:text-white h-full transform transition-all duration-300 hover:scale-102">
                    <p className="mb-3 text-xs">{testimonial.quote}</p>
                    <div className="flex items-center gap-2">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="rounded-full w-8 h-8 object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-xs">{testimonial.name}</h4>
                        <p className="text-xs text-gray-400">{testimonial.username}</p>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
    );
  };


export default TestimonialsSection;