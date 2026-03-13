import cron from "node-cron";
import { cancelExpiredOrders } from "./cancelExpiredOrders";

export function startJobs() {
  cron.schedule("* * * * *", async () => {
    await cancelExpiredOrders();
  });
}
