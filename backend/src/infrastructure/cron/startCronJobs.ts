import logger from "@/logger";
import { startScheduledPostsProcessor } from "./contentsCronJobs";
import { processWebhookQueue } from "./inboxJobProcess";


export const startCronJobs = () => {
  startScheduledPostsProcessor();
  processWebhookQueue()
  logger.info("All cron jobs started and processes.",{method:"cron-job"});
};
