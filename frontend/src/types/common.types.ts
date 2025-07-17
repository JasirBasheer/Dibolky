import store from "@/redux/store";
import { LucideProps } from "lucide-react";
import React, { ComponentType, ReactNode } from "react";

export interface NavbarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;


export interface IFilesMetaData {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  contentType: string
}

export interface IFile {
  id: string;
  file: File
  type: string;

}


export interface IFiles {
  fileName: string;
  contentType: string;
  key: string;
  uploadedAt: string;
}

export interface IMetadata {
  caption: string;
  metaAccountId: string
  isScheduled: boolean
  tags?: string[]
}

export interface IPlatforms {
  platform: string;
  scheduledDate?: string | Date;
  status?: string
}

export interface IContentData {
  _id?:string;
  files: IFiles[];
  metadata: IMetadata;
  platforms: IPlatforms[];
  contentType: string;
  caption?:string;
  status?:string;
  tags?:string[];
  createdAt?:string;
  updatedAt?:string;
}




export interface IMetaAccount {
  pageId: string;
  pageName: string;
  pageImage: string;
}


export interface IReviewBucket {
  _id: string;
  user_id?: string;
  orgId?: string;
  files: IFiles[];
  status: string;
  platforms: IPlatforms[];
  contentType: string;
  caption: string;
  tags?: string[];
  isPublished?: boolean;
  reason?: INote | null;
  createdAt?:string;
  updatedAt?:string;
}

export interface ICalendarContent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  platform: string[];
  contentType: string;
  status: string;
  isPublished: boolean;
  isRescheduled: boolean;
  mediaType: string;
  mediaUrl: string
  fileNames: string[]
}
export interface Seen {
  userId: string;
  seenAt: string;
}


export interface IMessage {
  _id?: string;
  chatId?: string;
  type?: 'text' | 'common' | 'deleted';
  senderId?: string;
  senderName?: string;
  text?: string;
  key?: string;
  contentType?: string;
  seen?: Seen[];
  createdAt?: string;
  updatedAt?: string;
}


export interface IParticipant {
  userId?: string;
  type?: string;
  name?: string;
  profile?: string;
  profileUrl?: string;
}


export interface MenuItemType {
  icon: ReactNode | ComponentType<LucideProps> | string;
  label: string;
  path: string[];
  subItems?: MenuItemType[];
};


export interface APIError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}



export interface IUpdateProfile {
  tenant_id?: string,
  profile: string,
  name: string,
  bio: string,
}

export interface ITableProps<T> {
  columns: any[];
  // columns: { key: keyof T; label: string; render?: (item: T) => React.ReactNode }[];
  data: T[];
  onClick?: (item: T) => void;
}



export interface IColumn<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
};

export interface IDataItem {
  name: string;
  category: string;
  client: { client_name: string };
  status: string;
  deadline: string;
};



export interface IAgencyProjects {
  _id: string;
  service_name: string;
  category: string;
  client: { client_name: string, client_id: string };
  status: string;
  dead_line: string | number | Date;
  service_details: Record<string, string>;
}

export interface IProject extends Omit<IAgencyProjects, '_id' | 'serviceName' | 'deadLine'> {
  id: string;
  name: string;
  deadline: string;
}



export interface IIntegratePaymentType {
  key1: string;
  key2: string;
  webhookUrl?: string
}


export interface IConnection {
  platform: string,
  is_valid: boolean,
  createdAt: Date
}





export interface Media {
  contentType: string;
  key: string;
  fileName?: string;
}

export interface INote {
  _id:string;
  entityType: string;
  entityId: string;
  note?: string;
  media?: Media[];
  addedBy: string;
  addedByModel: string;
  parentNote?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
