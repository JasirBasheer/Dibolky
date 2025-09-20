import { ISocialUserType } from "@/types";

export interface IInboxService {
  getInbox(
    orgId: string,
    entity: string,
    userId: string,
    selectedPlatforms: string[],
    selectedPages: string[]
  ): Promise<ISocialUserType[]>;

  getInboxMessages(
    orgId: string,
    userId: string,
    platform: string,
    conversationId: string
  ): Promise<object[]>;
}
