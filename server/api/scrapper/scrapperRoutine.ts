import schedule from "node-schedule";
import dailyScrapper from "./dailyScrapper";

const scrapperJob = schedule.scheduleJob("0 0 * * *", () => dailyScrapper());

export default scrapperJob;
