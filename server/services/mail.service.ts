import dotenv from "dotenv";
import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { EmailMessage } from "../types/interfaces/email.interface";

dotenv.config();

const hbs = require("nodemailer-express-handlebars");

const TRANSPORT_OPTIONS: SMTPTransport.Options = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
};

const hbsConfig = {
  viewEngine: {
    extName: ".hbs",
    defaultLayout: false,
  },
  viewPath: "./templates",
  extName: ".hbs",
};

export class EmailService {
  errorEmail = `${process.env.MAIL}`;
  transporter: Transporter<SMTPTransport.SentMessageInfo>;
  constructor() {
    this.transporter = nodemailer.createTransport(TRANSPORT_OPTIONS);
    this.transporter.use("compile", hbs(hbsConfig));

    this.transporter
      .verify()
      .then(() => {
        console.log("Ready to send emails");
      })
      .catch((e) => {
        console.log("Error mailer: ", { e });
      });
  }

  async sendMail(email: EmailMessage): Promise<SMTPTransport.SentMessageInfo> {
    return this.transporter.sendMail({
      ...{
        headers: [{ key: "X-Entity-Ref-ID", value: Date.now().toString() }],
      },
      ...email,
    });
  }
}

export const emailService = new EmailService();
