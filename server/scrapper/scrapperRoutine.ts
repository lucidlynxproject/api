import schedule from "node-schedule";
import dailyScrapper from "./dailyScrapper";

const scrapperJob = schedule.scheduleJob("30 */1 * * *", () => dailyScrapper());

export default scrapperJob;
