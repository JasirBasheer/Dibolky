import { startScheduledPostsProcessor } from "./contentsCronJobs";


export const startCronJobs = () => {
  startScheduledPostsProcessor();
  console.log("⏰ All cron jobs started.");
};
