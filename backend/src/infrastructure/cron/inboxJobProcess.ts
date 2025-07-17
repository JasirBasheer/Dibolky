import { getRedisClient } from "@/config";
import logger from "@/logger";

export async function processWebhookQueue() {
    const redisClient = getRedisClient()
//   while (true) {
//     const payload = await redisClient.brPop("webhook_queue", 0);
//     if (payload) {
//       const { entry } = JSON.parse(payload.element);
//       for (const event of entry) {
//         const pageId = event.id;
//         const page = await PageModel.findOne({ pageId });
//         if (!page) {
//           logger.error(`Page ${pageId} not found`);
//           continue;
//         }
//         const { orgId, platform, accessToken } = page;

//         for (const msgEvent of event.messaging) {
//           if (!msgEvent.message) continue;

//           const user = await syncUser(
//             msgEvent.sender.id,
//             platform,
//             accessToken,
//             pageId,
//             orgId
//           );

//           const conversation = await syncConversation(
//             pageId,
//             msgEvent.sender.id,
//             platform,
//             accessToken,
//             orgId,
//             msgEvent.message?.context?.id
//           );

//           await saveMessage(msgEvent, conversation.conversationId, platform, orgId);

//           await ConversationModel.updateOne(
//             { orgId, conversationId: conversation.conversationId },
//             { lastUpdated: new Date(msgEvent.timestamp) }
//           );
//           await SocialUserModel.updateOne(
//             { orgId, platform, externalUserId: user.externalUserId, linkedPage: pageId },
//             { lastSeen: new Date(msgEvent.timestamp) }
//           );
//         }
//       }
//     }
//   }
}

