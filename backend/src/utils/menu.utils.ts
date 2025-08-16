import { IMenu } from "@/types";

const dashboard = {
  title: "Dashboard",
  icon: "Home",
  items: [
    {
      title: "Overview",
      url: "/",
    }
  ],
};

const ourWork = {
  title: "Our Work",
  icon: "Briefcase",
  items: [
    {
      title: "Portfolio",
      url: "/work/portfolio",
    },
    {
      title: "Case Studies",
      url: "/work/case-studies",
    },
    {
      title: "Clients Testimonials",
      url: "/work/testimonials",
    },
  ],
};

const clientManagement = {
  title: "Client Management",
  icon: "Users",
  items: [
    {
      title: "All Clients",
      url: "/clients",
    },
    {
      title: "Create Client",
      url: "/clients/create",
    },
  ],
};

const contentAndProjects = {
  title: "Content & Projects",
  icon: "FolderOpen",
  items: [
    {
      title: "All Projects",
      url: "/projects",
    },
    {
      title: "Content Library",
      url: "/contents",
    },
    {
      title: "Media",
      url: "/media",
    },
  ],
};

const projects = {
  title: "Projects",
  icon: "FolderOpen",
  items: [
    {
      title: "All Projects",
      url: "/projects",
    },
  ],
};

const communications = {
  title: "Communications",
  icon: "MessageSquare",
  items: [
    {
      title: "Messages",
      url: "/messages",
    },
    {
      title: "Inbox",
      url: "/inbox",
    },
    {
      title: "Leads",
      url: "/leads",
    },
  ],
};

const clientCommunications = {
  title: "Communications",
  icon: "MessageSquare",
  items: [
    {
      title: "Messages",
      url: "/messages",
    }
  ],
};

const invoiceManagement = {
  title: "Invoice Management",
  icon: "FileText",
  items: [
    {
      title: "All Invoices",
      url: "/invoices",
    },
    {
      title: "Create Invoice",
      url: "/invoices/create",
    },
    {
      title: "Payments",
      url: "/invoices/payments",
    },
    {
      title: "Overdue Invoices",
      url: "/invoices/overdue",
    },
  ],
};


const clientInvoiceManagement = {
  title: "Invoice Management",
  icon: "FileText",
  items: [
    {
      title: "All Invoices",
      url: "/invoices",
    },
    {
      title: "Payments",
      url: "/invoices/payments",
    },
    {
      title: "Overdue Invoices",
      url: "/invoices/overdue",
    },
  ],
};

// const performance = {
//   title: "Performance",
//   icon: "LineChart",
//   items: [
//     {
//       title: "Social Insights",
//       url: "/performance/social",
//     },
//     {
//       title: "Competitor Analysis",
//       url: "/performance/competitor-analysis",
//     },
//   ],
// };

const billingAndPlans = {
  title: "Billing & Plans",
  icon: "CreditCard",
  items: [
    {
      title: "Upgrade Plan",
      url: "/billing/upgrade",
    },
    {
      title: "Payment History",
      url: "/billing/history",
    },
  ],
};

const toolsAndSettings = {
  title: "Tools & Settings",
  icon: "Settings2",
  items: [
    {
      title: "Settings",
      url: "/settings",
    },
    {
      title: "Integrations",
      url: "/integrations",
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
    // "Performance": performance, 
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
