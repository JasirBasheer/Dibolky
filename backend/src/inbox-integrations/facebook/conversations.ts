import axios from "axios";
import { env } from "@/config";
import { isErrorWithMessage } from "@/validators";

type FBUserRef = {
  name?: string;        
  email?: string;      
  id: string;
};

type FBParticipants = {
  data: FBUserRef[];
};

type FBConversation = {
  id: string;
  participants: FBParticipants;
  updated_time: string;
};

type FBPagingCursors = {
  before?: string;
  after?: string;
};

type FBPaging = {
  previous?: string;
  next?: string;
  cursors?: FBPagingCursors;
};

type FBConversationsResponse = {
  data: FBConversation[];
  paging?: FBPaging;
};


export async function getFBConversations(
  pageId: string,
  access_token: string
): Promise<FBConversationsResponse> {
  const url = `https://graph.facebook.com/${env.META.API_VERSION}/${pageId}/conversations`;
  try {
    const response = await axios.get(url, {
      params: {
        access_token,
        fields: "id,participants,updated_time",
      },
    });
    return response.data;
  } catch (error: unknown) {
    const errorMessage = isErrorWithMessage(error) ? error.message : "Unknown error";
    console.error("Error fetching FB conversations:", errorMessage);
    throw new Error("Failed to fetch FB conversations");
  }
}


type FBRecipient = {
  data: FBUserRef[];
};

type FBMessageAttachmentImageData = {
  url?: string;
  width?: number;
  height?: number;
  max_width?: number;
  max_height?: number;
  image_type?: string;
};

type FBMessageAttachmentFileData = {
  url?: string;     
  is_malicious?: boolean;
  name?: string;      
  mime_type?: string;
  size?: number;      
};

type FBMessageAttachmentPayload = {
  image_data?: FBMessageAttachmentImageData;
  file_url?: string;
} & Record<string, unknown>;

type FBMessageAttachment = {
  id?: string;            
  mime_type?: string;    
  name?: string;          
  size?: number;        
  file_url?: string;     
  image_data?: FBMessageAttachmentImageData;
  target?: { id?: string; url?: string };
  type?: string;         
  payload?: FBMessageAttachmentPayload;
} & Record<string, unknown>;

type FBAttachmentsEdge = {
  data: FBMessageAttachment[];
};

type FBMessage = {
  id: string;
  message?: string;         
  created_time: string;     
  from?: FBUserRef;         
  to?: FBRecipient;       
  attachments?: FBAttachmentsEdge;
};

type FBMessagesResponse = {
  data: FBMessage[];
  paging?: FBPaging;
};



export async function getFBMessages(
  conversation_id: string,
  access_token: string
): Promise<FBMessagesResponse> {
  const url = `https://graph.facebook.com/${env.META.API_VERSION}/${conversation_id}/messages`;
  try {
    const response = await axios.get(url, {
      params: {
        fields: "from,to,message,created_time,id,attachments", 
        access_token,
      },
    });
    return response.data;
  } catch (error: unknown) {
    const errorMessage = isErrorWithMessage(error) ? error.message : "Unknown error";
    console.error("Error fetching FB messages:", errorMessage);
    throw new Error("Failed to fetch FB messages");
  }
}



type FBProfilePicture = {
  data: {
    height?: number;
    width?: number;
    url: string;
    is_silhouette: boolean;
  };
};

export type FBMessageSenderDetails = {
  id: string;        
  name?: string;        
  first_name?: string;  
  last_name?: string;   
  profile_picture?: FBProfilePicture;
};



export async function getFBMessageSenderDetails(
  userId: string,
  access_token: string
): Promise<FBMessageSenderDetails> {
  const url = `https://graph.facebook.com/${env.META.API_VERSION}/${userId}`;
  try {
    const response = await axios.get(url, {
      params: {
        fields: "name,first_name,last_name,profile_picture",
        access_token,
      },
    });
    return response.data;
  } catch (error: unknown) {
    const errorMessage = isErrorWithMessage(error) ? error.message : "Unknown error";
    console.error("Error fetching FB messages:", errorMessage);
    throw new Error("Failed to fetch FB messages");
  }
}