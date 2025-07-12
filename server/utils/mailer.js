import nodemailer from "nodemailer";

let smtpTransport = nodemailer.createTransport({
  host: "mail.smtp2go.com",
  port: 2525, // 8025, 587 and 25 can also be used.
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASS,
  },
});

export function getSmptTransport() {
  return smtpTransport;
}
