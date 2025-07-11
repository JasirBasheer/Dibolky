import logger from "@/logger";
import { startScheduledPostsProcessor } from "./contentsCronJobs";


export const startCronJobs = () => {
  startScheduledPostsProcessor();
  logger.info("All cron jobs started.",{method:"cron-job"});
};
