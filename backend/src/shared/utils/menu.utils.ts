const smm = {
    smm: {
        label: "SMM",
        icon: "BarChart",
        subItems: [
            {
                label: "Projects",
                icon: "FileText",
                path: ["/projects"]
            },
            {
                label: "Content",
                icon: "Pen",
                path: ["/contents"]
            },
            {
                label: "Media",
                icon: "GalleryVertical",
                path: ["/media"]
            },
            {
                label: "Calendar",
                icon: "CalendarDays",
                path: ["/calendar"]
            },
            {
                label: "Inbox",
                icon: "Send",
                path: ["/inbox"]
            },
            {
                label: "Analytics",
                icon: "ChartNoAxesCombined",
                path: ["/smm/analytics"]
            }
        ]
    }
}

const marketing = {
    marketing: {
        label: "MARKETING",
        icon: "BarChart",
        subItems: [
            {
                label: "SEO",
                icon: "FileText",
                path: ["/seo"]
            },
            {
                label: "GOOGLE ADS",
                icon: "Pen",
                path: ["/contents"]
            },
            {
                label: "META ADS",
                icon: "GalleryVertical",
                path: ["/media"]
            },
            {
                label: "Analytics",
                icon: "ChartNoAxesCombined",
                path: ["/marketing/analytics"]
            }
        ]
    }
}


const crm = {
    crm: {
        label: "CRM",
        icon: "Users",
        subItems: [
          {
            label: "Clients",
            icon: "Users",
            path: [
              "/clients",
              "/create-client"
            ]
          },
          {
            label: "Leads",
            icon: "ChartBarStacked",
            path: ["/leads"]
          },
          {
            label: "Messages",
            icon: "MessageSquareText",
            path: ["/messages"]
          }
        ]
      }
}


const accounting = {
    accounting: {
        label: "Accounting",
        icon: "DollarSign",
        subItems: [
          {
            label: "History",
            icon: "FileClock",
            path: ["/history"]
          },
          {
            label: "Invoices",
            icon: "FileText",
            path: ["/invoices"]
          },
          {
            label: "Reports",
            icon: "FileChartColumn",
            path: ["/reports"]
          }
        ]
      }
}




const clientBaseMenu: any = {
    "Digital Marketing": smm,
    "Social Media Marketing": smm,
    "Content Creation": smm,
    "Photography": smm,
    "Videography": smm,
    "Mixed Reality Videos": smm,
    "Search Engine Optimization": marketing,
    "Google Ads and PPC": marketing,
};

const planBaseMenu: any = {
    "SMM": smm,
    "MARKETING": marketing,
    "CRM": crm,
    "ACCOUNTING":accounting
};



export const createNewMenuForClient = (selectedKeys: string[]) => {
    console.log(selectedKeys)
    const result: any = {};
    const seen = new Set();

    selectedKeys.forEach(key => {
        const menu = clientBaseMenu[key];

        const menuKey = Object.keys(menu)[0];

        if (!seen.has(menuKey)) {
            seen.add(menuKey);
            result[menuKey] = menu[menuKey];
        }
    });

    return result;
};



export const createNewPlanMenu = (selectedKeys: string[]) => {
    console.log(selectedKeys)
    const result: any = {};
    const seen = new Set();

    selectedKeys.forEach(key => {
        const menu = planBaseMenu[key];

        const menuKey = Object.keys(menu)[0];

        console.log(menu)
        console.log(menuKey,)

        if (!seen.has(menuKey)) {
            seen.add(menuKey);
            result[menuKey] = menu[menuKey];
        }
    });
    console.log(result);

    return result;
};