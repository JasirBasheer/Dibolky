import cron from "node-cron";
import Agencies from "../../models/Implementation/agency";
import { connectTenantDB } from "../../config/db.config";
import { bucketSchema } from "../../models/Implementation/bucket";
import { container } from "tsyringe";
import { Types } from "mongoose";
import { IProviderService } from "../../services/Interface/IProviderService";
import { IClientService } from "../../services/Interface/IClientService";
import { IAgencyService } from "../../services/Interface/IAgencyService";
import { IAgencyTenant } from "../../types/agency";
import {
  IPlatforms,
  IBucket,
  ISocialMediaUploadResponse,
} from "@/types/";
import logger from "@/logger";
import { IClientTenant } from "@/models";

async function processAgencyScheduledPosts() {
  try {
    const clientService = container.resolve<IClientService>("ClientService");
    const agencyService = container.resolve<IAgencyService>("AgencyService");
    const providerService = container.resolve<IProviderService>(
      "ProviderService"
    );

    const now = new Date();
    const endTime = new Date(now.getTime() + 5 * 60 * 1000);

    let agencies = await Agencies.find();

    for (let agency of agencies) {
      const db = await connectTenantDB(agency.orgId);
      const ReviewBucket = db.model("reviewBucket", bucketSchema);

      const scheduledContents = await ReviewBucket.find({
        status: "Approved",
        isPublished: false,
      });

      const filteredScheduledContents = scheduledContents
      .map((content) => {
          const validPlatforms = content.platforms.filter((platform) => {
              if (platform.scheduledDate == "") return false;
  
               const parsed = new Date(platform.scheduledDate);
              if (isNaN(parsed.getTime())) {
                  logger.warn(`Invalid scheduledDate: ${platform.scheduledDate}`);
                  return false;
              }

              return (
                  !["success", "failed"].includes(platform.status) &&
                    parsed >= now &&
                    parsed <= endTime
              );
          });
  
          return validPlatforms.length > 0
              ? { ...content.toObject(), platforms: validPlatforms }
              : null;
      })
      .filter(Boolean);




      for (let content of filteredScheduledContents) {
        if ((content.platforms ?? []).length > 0) {
          let user: IAgencyTenant | IClientTenant | null =
            await clientService.getClientTenantDetailsById(
              agency.orgId,
              content?.user_id as string
            );

          if (!user) {
            user = await agencyService.getAgencyOwnerDetails(agency.orgId);
          }

          const result: ISocialMediaUploadResponse[] =
            await providerService.handleSocialMediaUploads(
              content as unknown as IBucket,
              user,
              true
            );

          if (result?.length) {
            for (let platform of result) {
              const foundContent = await ReviewBucket.findOne({
                _id: new Types.ObjectId(platform.id),
              });

              if (foundContent) {
                await foundContent.changePlatformPublishStatus(
                  String(platform.name),
                  true
                );
              }
            }
          }
        }
      }
    }
  } catch (error) {
    logger.error("Error processing scheduled posts:", error);
  }
}

export function startScheduledPostsProcessor() {
  cron.schedule("*/2 * * * *", async () => {
    logger.info("CRON JOB RUNNING at " + new Date().toISOString());
    await processAgencyScheduledPosts();
  });
}
