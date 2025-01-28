
type Input = {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    options?: string[]; 
  };
  
  type Service = {
    label: string;
    inputs: Input[];
  };
  
  type Services = {
    [key: string]: Service; 
  };
  
  
  
  export const SERVICES: Services = {
    DM: {
      label: "Digital Marketing",
      inputs: [
        { name: "budget", label: "Budget", type: "number", placeholder: "Enter amount" },
        { name: "targetAudience", label: "Target Audience", type: "text", placeholder: "eg: Age 25-45, professionals" },
        { name: "marketingGoals", label: "Marketing Goals", type: "text", placeholder: "eg: Brand Awareness, Lead Generation" }
      ]
    },
  
    SM: {
      label: "Social Media Marketing",
      inputs: [
        { name: "budget", label: "Budget", type: "number", placeholder: "Enter amount" },
        { name: "postFrequency", label: "Posts per Week", type: "number", placeholder: "eg: 3, 5, 7" },
        { name: "contentType", label: "Content Types", type: "text", placeholder: "eg: Images, Videos, Stories" },
        {
          name: "communityManagement", label: "Community Management", type: "select",
          options: ["Basic", "Standard", "Premium"],
          placeholder: "Select level"
        }
      ]
    },
  
    SEO: {
      label: "Search Engine Optimization",
      inputs: [
        { name: "budget", label: "Budget", type: "number", placeholder: "Enter amount" },
        { name: "keywords", label: "Target Keywords", type: "text", placeholder: "eg: digital marketing, SEO" },
        { name: "competitors", label: "Main Competitors", type: "text", placeholder: "eg: site1.com, site2.com" },
        { name: "targetLocations", label: "Target Locations", type: "text", placeholder: "eg: New York, London" },
        {
          name: "serviceType", label: "Service Type", type: "select",
          options: ["Local SEO", "National SEO", "International SEO", "E-commerce SEO"],
          placeholder: "Select type"
        }
      ]
    },
  
    CC: {
      label: "Content Creation",
      inputs: [
        { name: "budget", label: "Budget", type: "number", placeholder: "Enter amount" },
        { name: "contentTypes", label: "Content Types", type: "text", placeholder: "eg: blogs, articles, emails" },
        {
          name: "contentLength", label: "Average Content Length", type: "select",
          options: ["Short-form", "Medium-form", "Long-form"],
          placeholder: "Select length"
        },
        {
          name: "frequency", label: "Content Frequency", type: "select",
          options: ["Daily", "Weekly", "Monthly"],
          placeholder: "Select frequency"
        },
        {
          name: "language", label: "Content Language", type: "select",
          options: ["English", "Spanish", "French", "German", "Arabic", "Chinese"],
          placeholder: "Select language"
        }
      ]
    },
  
    GADSPPC: {
      label: "Google Ads and PPC",
      inputs: [
        { name: "Budget", label: "Budget", type: "number", placeholder: "Enter amount" },
        { name: "targetLocations", label: "Target Locations", type: "text", placeholder: "eg: USA, Canada" },
        {
          name: "goals", label: "Campaign Goals", type: "select",
          options: ["Sales", "Leads", "Website Traffic", "Brand Awareness", "App Promotion"],
          placeholder: "Select goal"
        },
        { name: "adPlatforms", label: "Platforms", type: "text", placeholder: "eg: Google Ads, Facebook Ads" }
      ]
    },
  
    CS: {
      label: "Campaign Strategies",
      inputs: [
        { name: "budget", label: "Campaign Budget", type: "number", placeholder: "Enter amount" },
        { name: "duration", label: "Campaign Duration (weeks)", type: "number", placeholder: "eg: 4, 8" },
        {
          name: "campaignType", label: "Campaign Type", type: "select",
          options: ["Product Launch", "Brand Awareness", "Lead Generation", "Sales Promotion", "Event Marketing"],
          placeholder: "Select type"
        },
        { name: "targetAudience", label: "Target Audience", type: "text", placeholder: "eg: professionals, students" }
      ]
    },
  
    PHOTO: {
      label: "Photography",
      inputs: [
        { name: "budget", label: "Project Budget", type: "number", placeholder: "Enter amount" },
        { name: "shootType", label: "Type of Shoot", type: "text", placeholder: "eg: Product, Portrait" },
        {
          name: "location", label: "Shoot Location", type: "select",
          options: ["Studio", "On-location", "Outdoor", "Mixed"],
          placeholder: "Select location"
        }
      ]
    },
  
    VIDEO: {
      label: "Videography",
      inputs: [
        { name: "budget", label: "Project Budget", type: "number", placeholder: "Enter amount" },
        {
          name: "videoType", label: "Type of Video", type: "select",
          options: ["Corporate", "Commercial", "Event", "Product", "Documentary", "Social Media"],
          placeholder: "Select type"
        },
        { name: "duration", label: "Video Duration (minutes)", type: "number", placeholder: "eg: 2, 5" },
        { name: "additionalServices", label: "Additional Services", type: "text", placeholder: "eg: Scripting, Animation" }
      ]
    },
  
    MR: {
      label: "Mixed Reality Videos",
      inputs: [
        { name: "budget", label: "Project Budget", type: "number", placeholder: "Enter amount" },
        { name: "realityType", label: "Reality Type", type: "text", placeholder: "eg: AR, VR, MR" },
        { name: "duration", label: "Video Duration (minutes)", type: "number", placeholder: "eg: 2, 5" },
        { name: "platforms", label: "Target Platforms", type: "text", placeholder: "eg: AR, VR, WebAR" },
        { name: "features", label: "Required Features", type: "text", placeholder: "eg: 3D Models, Animation" },
        {
          name: "purpose", label: "Purpose", type: "select",
          options: ["Product Visualization", "Training", "Entertainment", "Educational", "Marketing", ""],
          placeholder: "Select purpose"
        }
      ]
    }
  };
  
  