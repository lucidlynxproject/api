import schedule from "node-schedule";
import dailyScrapper from "./dailyScrapper";

const scrapperJob = schedule.scheduleJob("0 2 * * *", () => dailyScrapper());

export default scrapperJob;
