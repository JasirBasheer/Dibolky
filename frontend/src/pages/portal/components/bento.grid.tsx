import { BentoCard, BentoGrid } from "@/components/magic.ui/bento.grid"
import { BellIcon, CalendarIcon, FileTextIcon, MessageSquareIcon, SparklesIcon, BarChart3Icon } from "lucide-react"
import { useEffect, useRef, useState } from "react";

const features = [
  {
    Icon: FileTextIcon,
    name: "Content Publishing",
    description: "Create, edit, and publish content across multiple platforms with a single click.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3 min-h-[16rem]",
  },
  {
    Icon: CalendarIcon,
    name: "Smart Scheduling",
    description: "Schedule your content for optimal engagement times with AI-powered recommendations.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3 min-h-[16rem]" ,
  },
  {
    Icon: SparklesIcon,
    name: "AI Integration",
    description: "Generate and enhance content with our advanced AI tools and workflows.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4 min-h-[16rem]",
  },
  {
    Icon: MessageSquareIcon,
    name: "Chat Support",
    description: "Engage with your audience through integrated chat functionality.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2 min-h-[16rem]",
  },
  {
    Icon: BellIcon,
    name: "Notifications",
    description: "Get real-time alerts on engagement, performance metrics, and audience interactions.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4 min-h-[16rem]",
  },
  {
    Icon: BellIcon,
    name: "Notifications",
    description: "Get real-time alerts on engagement, performance metrics, and audience interactions.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4 min-h-[16rem]",
  },
  {
    Icon: BellIcon,
    name: "Notifications",
    description: "Get real-time alerts on engagement, performance metrics, and audience interactions.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4 min-h-[16rem]",
  },
  {
    Icon: BarChart3Icon,
    name: "Lead Generation",
    description: "Integrate with Google and Meta ads to capture and convert high-quality leads.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-4 lg:col-end-4 lg:row-start-1 lg:row-end-4 min-h-[16rem]",
  },
  
]



export function FeaturesCard() {
  const [visibleItems, setVisibleItems] = useState([]);
  const bentoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
          const index = parseInt((entry.target as HTMLElement).dataset.index);
            setVisibleItems(prev => {
              if (!prev.includes(index)) {
                return [...prev, index];
              }
              return prev;
            });
          }
        });
      },
      { threshold: 0.1 } 
    );

    const featureElements = document.querySelectorAll('.feature-item');
    featureElements.forEach(element => {
      observer.observe(element);
    });

    return () => {
      featureElements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <section className="w-full md:h-[46rem]" id="features">
      <div className="w-full max-w-7xl mx-auto px-4" ref={bentoRef}>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-lazare font-bold mb-4 text-foreground/90">
            Powerful Features
          </h2>
          <p className="text-lg font-lazare font-bold text-gray-500 max-w-2xl mx-auto">
            Discover all the ways our platform can help you scale with confidence
          </p>
        </div>
        
        <BentoGrid className="lg:grid-rows-3 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.name}
              className={`feature-item transition-all duration-700 ease-out transform ${
                visibleItems.includes(index) 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-9 opacity-0'
              } mt-4`}
              data-index={index}
            >
              <BentoCard {...feature} />
            </div>
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}   