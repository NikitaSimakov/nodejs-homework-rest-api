import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const { EMAIL_PASSWORD, EMAIL_ADDRESS } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: { user: EMAIL_ADDRESS, pass: EMAIL_PASSWORD },
};

export const transport = nodemailer.createTransport(nodemailerConfig);

export const sendVerificationEmail = async (data) => {
  const email = { ...data, from: EMAIL_ADDRESS };

  await transport.sendMail(email);
  return true;
};
