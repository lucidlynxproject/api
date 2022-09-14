import schedule from "node-schedule";
import dailyScrapper from "./dailyScrapper";

const scrapperJob = schedule.scheduleJob("00 */6 * * *", () => dailyScrapper());

export default scrapperJob;
