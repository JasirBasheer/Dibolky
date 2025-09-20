import { inject, injectable } from "tsyringe";
import { CustomError } from "mern.common";
import { IInboxService } from "../Interface/IInboxService";
import {
  InstagramConversation,
  InstagramMessage,
  ISocialUserType,
} from "@/types";
import {
  IAgencyTenantRepository,
  IClientTenantRepository,
  ISocialMessageRepository,
  ISocialUserRepository,
} from "@/repositories";
import { decryptToken, PLATFORMS, ROLES } from "@/utils";
import { getPages } from "@/media-service/shared";
import { getIGTokenDetails } from "@/providers/meta";
import {
  getIGConversations,
  getIGMessages,
  getIGMessageSenderDetails,
} from "@/inbox-integrations";
import { isErrorWithMessage } from "@/validators";

@injectable()
export class InboxService implements IInboxService {
  constructor(
    @inject("AgencyTenantRepository")
    private readonly _agencyTenantRepository: IAgencyTenantRepository,
    @inject("ClientTenantRepository")
    private readonly _clientTenantRepository: IClientTenantRepository,
    @inject("SocialUserRepository")
    private readonly _socialUserRepository: ISocialUserRepository,
    @inject("SocialMessageRepository")
    private readonly _socialMessageRepository: ISocialMessageRepository
  ) {}

  async getInbox(
    orgId: string,
    entity: string,
    userId: string,
    selectedPlatforms: string[],
    selectedPages: string[]
  ): Promise<ISocialUserType[]> {
    try {
      const user =
        entity === ROLES.AGENCY
          ? await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
          : await this._clientTenantRepository.getClientById(orgId, userId);

      const users: ISocialUserType[] = [];
      for (const platform of selectedPlatforms) {
        let platformUsers = [];

        if (platform === PLATFORMS.INSTAGRAM) {
          if (!user?.social_credentials?.instagram?.accessToken) return [];

          platformUsers = (
            await Promise.all(
              selectedPages.map(async (pageId) => {
                const usersWithPageId =
                  await this._socialUserRepository.getUsersWithPageId(
                    orgId,
                    userId,
                    platform,
                    pageId
                  );
                return usersWithPageId;
              })
            )
          ).flat();

          if (platformUsers.length > 0) users.push(...platformUsers);

          const pagesWithNoUsers = selectedPages.filter(
            (pageId) => !platformUsers.some((u) => u.linkedPage === pageId)
          );
          console.log(pagesWithNoUsers.length);
          if (pagesWithNoUsers.length > 0) {
            const token = decryptToken(
              user.social_credentials.instagram.accessToken
            );
            const pages = await getPages(token);
            const validPages = pages.data.filter((page) =>
              pagesWithNoUsers.includes(page.id)
            );
            const pageUsers = await Promise.all(
              validPages.map(async (page) => {
                const tokenDetails = await getIGTokenDetails(
                  page.id,
                  page.access_token
                );
                if (!tokenDetails) return [];

                const conversations = await getIGConversations(
                  page.id,
                  page.access_token
                );

                const conversationUsers = await Promise.all(
                  conversations.map(
                    async (conversation: InstagramConversation) => {
                      const messages = await getIGMessages(
                        conversation.id,
                        page.access_token
                      );
                      if (!messages.length) return null;
                      const validMessages = messages.filter(
                        (msg: InstagramMessage) =>
                          msg.message.trim() !== "" ||
                          (msg.attachments && msg.attachments.data.length > 0)
                      );

                      if (validMessages.length === 0) return null;
                      const otherUser =
                        messages.find(
                          (msg: InstagramMessage) =>
                            msg.from.id !== tokenDetails.id ||
                            msg.to.data[0].id !== tokenDetails.id
                        )?.from.id !== tokenDetails.id
                          ? messages.find(
                              (msg: InstagramMessage) =>
                                msg.from.id !== tokenDetails.id
                            )?.from
                          : messages.find(
                              (msg: InstagramMessage) =>
                                msg.to.data[0].id !== tokenDetails.id
                            )?.to.data[0];

                      if (!otherUser) return null;
                      const userDetails = await getIGMessageSenderDetails(
                        otherUser.id,
                        page.access_token
                      );
                      const socialUser =
                        await this._socialUserRepository.createUser(orgId, {
                          platform,
                          externalUserId: otherUser.id,
                          userId,
                          conversationId: conversation.id,
                          userName: userDetails.username || userDetails.name,
                          name: userDetails.name || userDetails.username,
                          profile: userDetails.profile_picture_url || "",
                          linkedPage: page.id,
                          lastSeen: new Date(messages[0].created_time),
                        });

                      const socialMessages = messages.map(
                        (msg: InstagramMessage) => ({
                          platform,
                          userId,
                          linkedPage: page.id,
                          conversationId: conversation.id,
                          externalMessageId: msg.id,
                          senderId: msg.from.id,
                          isFromMe: msg.from.id === tokenDetails.id,
                          content: msg.message || undefined,
                          media:
                            msg.attachments?.data.map((att) => ({
                              id: att.id,
                              url: att.image_data?.url || "",
                            })) || [],
                          timestamp: new Date(msg.created_time),
                          status: "received",
                        })
                      );

                      await this._socialMessageRepository.createMessages(
                        orgId,
                        socialMessages
                      );

                      return {
                        _id: socialUser._id,
                        platform,
                        externalUserId: otherUser.id,
                        userId,
                        conversationId: conversation.id,
                        name: userDetails.name || userDetails.username,
                        profile: userDetails.profile_picture_url || "",
                        linkedPage: page.id,
                        lastSeen: new Date(messages[0].created_time),
                      } as ISocialUserType;
                    }
                  )
                );

                return conversationUsers.filter(
                  (u): u is ISocialUserType => u !== null
                );
              })
            );

            users.push(...pageUsers.flat());
          }
        } else {
          platformUsers = await this._socialUserRepository.getUsers(
            orgId,
            userId,
            platform
          );
          if (platformUsers.length > 0) {
            users.push(...platformUsers);
          }
        }
      }

      return users;
    } catch (error: unknown) {
      const errorMessage = isErrorWithMessage(error)
        ? error.message
        : "Unknown error";
      console.error("Error fetching inbox:", errorMessage);
      throw new CustomError("Error while fetching chats", 500);
    }
  }

  async getInboxMessages(
    orgId: string,
    userId: string,
    platform: string,
    conversationId: string
  ): Promise<any> {
    const messages = await this._socialMessageRepository.getMessages(
      orgId,
      userId,
      platform,
      conversationId
    );
    return messages;
  }
}
