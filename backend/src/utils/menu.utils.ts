import { IMenu } from "@/types";

const dashboard = {
  title: "Dashboard",
  icon: "Home",
  items: [
    {
      title: "Overview",
      url: "/agency",
    },
    {
      title: "Analytics",
      url: "/agency/analytics",
    },
    {
      title: "Reports",
      url: "/agency/reports",
    },
  ],
};

const ourWork = {
  title: "Our Work",
  icon: "Briefcase",
  items: [
    {
      title: "Portfolio",
      url: "/agency/work/portfolio",
    },
    {
      title: "Case Studies",
      url: "/agency/work/case-studies",
    },
    {
      title: "Client Testimonials",
      url: "/agency/work/testimonials",
    },
    {
      title: "Before & After",
      url: "/agency/work/before-after",
    },
  ],
};

const clientManagement = {
  title: "Client Management",
  icon: "Users",
  items: [
    {
      title: "All Clients",
      url: "/agency/clients",
    },
    {
      title: "Create Client",
      url: "/agency/create-client",
    },
    {
      title: "Client Reports",
      url: "/agency/client-reports",
    },
  ],
};

const contentAndProjects = {
  title: "Content & Projects",
  icon: "FolderOpen",
  items: [
    {
      title: "All Projects",
      url: "/agency/projects",
    },
    {
      title: "Content Library",
      url: "/agency/contents",
    },
    {
      title: "Comments",
      url: "/agency/comments",
    },
    {
      title: "Media",
      url: "/agency/media",
    },
  ],
};

const projects = {
  title: "Projects",
  icon: "FolderOpen",
  items: [
    {
      title: "All Projects",
      url: "/agency/projects",
    },
  ],
};

const communications = {
  title: "Communications",
  icon: "MessageSquare",
  items: [
    {
      title: "Messages",
      url: "/agency/messages",
    },
    {
      title: "Inbox",
      url: "/agency/inbox",
    },
    {
      title: "Leads",
      url: "/agency/leads",
    },
  ],
};

const clientCommunications = {
  title: "Communications",
  icon: "MessageSquare",
  items: [
    {
      title: "Messages",
      url: "/agency/messages",
    }
  ],
};

const invoiceManagement = {
  title: "Invoice Management",
  icon: "FileText",
  items: [
    {
      title: "All Invoices",
      url: "/agency/invoices",
    },
    {
      title: "Create Invoice",
      url: "/agency/invoices/create",
    },
    {
      title: "Payments",
      url: "/agency/invoices/payments",
    },
    {
      title: "Overdue Invoices",
      url: "/agency/invoices/recurring",
    },
  ],
};


const clientInvoiceManagement = {
  title: "Invoice Management",
  icon: "FileText",
  items: [
    {
      title: "All Invoices",
      url: "/agency/invoices",
    },
    {
      title: "Payments",
      url: "/agency/invoices/payments",
    },
    {
      title: "Overdue Invoices",
      url: "/agency/invoices/recurring",
    },
  ],
};

const performance = {
  title: "Performance",
  icon: "LineChart",
  items: [
    {
      title: "Social Insights",
      url: "/agency/performance/social",
    },
    {
      title: "Website Analytics",
      url: "/agency/performance/website",
    },
    {
      title: "Conversion Reports",
      url: "/agency/performance/conversions",
    },
  ],
};

const billingAndPlans = {
  title: "Billing & Plans",
  icon: "CreditCard",
  items: [
    {
      title: "Your Plan",
      url: "/agency/billing/plan",
    },
    {
      title: "Upgrade Plan",
      url: "/agency/billing/upgrade",
    },
    {
      title: "Payment History",
      url: "/agency/billing/history",
    },
  ],
};

const toolsAndSettings = {
  title: "Tools & Settings",
  icon: "Settings2",
  items: [
    {
      title: "Calendar",
      url: "/agency/calendar",
    },
    {
      title: "Settings",
      url: "/agency/settings",
    },
    {
      title: "Integrations",
      url: "/agency/integrations",
    },
  ],
};



const clientBaseMenu: Record<string, IMenu> = {
  "Digital Marketing": contentAndProjects,
  "Social Media Marketing": contentAndProjects,
  "Content Creation": contentAndProjects,
  "Photography": projects,
  "Videography": projects,
  "Mixed Reality Videos": projects,
  "Search Engine Optimization": projects,
  "Google Ads and PPC": projects,
  "Campaign Strategies": projects,
};

const planMenu: Record<string, IMenu> = {
    "Dashboard":dashboard, 
    "Our Work": ourWork, 
    "Client Management": clientManagement, 
    "Content & Projects": contentAndProjects,
    "Communications": communications, 
    "Invoice Management": invoiceManagement, 
    "Performance": performance, 
    "Billing & Plans": billingAndPlans, 
    "Tools & Settings":toolsAndSettings 
};

export const createNewMenuForClient = (selectedKeys: string[]) => {
  const result: IMenu[] = [dashboard, ourWork];
  const addedMenus = new Set<string>();

  selectedKeys.forEach((key) => {
    const menu = clientBaseMenu[key];
    const menuKey = menu.title; 

    if (addedMenus.has(menuKey)) return;
    if ( menu.title === projects.title && addedMenus.has(contentAndProjects.title))return

    if (menu.title === contentAndProjects.title && addedMenus.has(projects.title)) {
      const filtered = result.filter( (m) => m.title !== projects.title);
      result.length = 0;
      result.push(...filtered);
      addedMenus.delete(projects.title);
    }
    result.push(menu);
    addedMenus.add(menuKey);
  });

  if(selectedKeys.includes("Social Media Marketing") || selectedKeys.includes("Content Creation") || selectedKeys.includes("Digital Marketing")){
    result.push(communications)
    }else{
      result.push(clientCommunications)
    }
  result.push(clientInvoiceManagement,toolsAndSettings)

  return result;
};


export const createMenu = (selectedKeys: string[]) => {
  let result: IMenu[] = [];

  selectedKeys.forEach((key) => {
    const menu = planMenu[key];
    result.push(menu);
  });
  return result;
};
