export interface Item {
    title: string;
    url: string;
}

export interface IMenu {
    title: string;
    icon: string;
    items: Item[];
}

export interface Plan {
    id?: string;
    name: string;
    description:string;
    price: number;
    features: string[];
    billingCycle:  string;
    maxProjects: number;
    maxClients: number;
    menu: IMenu[]
    isActive:boolean;
    permissions:string[]
    createdAt: Date
    type: string
}