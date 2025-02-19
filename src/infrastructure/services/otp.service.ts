import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { mailConfig } from '../../config/env';

export class OTPService {
  private static otpStore: Map<string, string> = new Map();

  static generateOTP(email: string): string {
    console.log("Generating OTP");
    const otp = crypto.randomInt(100000, 999999).toString();
    this.otpStore.set(email, otp);
    setTimeout(() => this.otpStore.delete(email), 300000);
    return otp;
  }

  static verifyOTP(email: string, otp: string): boolean {
    console.log("Verifying OTP");
    console.log("email : ",email);
    console.log("otp : ",otp);
    return this.otpStore.get(email) === otp;
  }

  static async sendOTP(email: string, otp: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: mailConfig.user,
        pass: mailConfig.password,
      },
    });

    await transporter.sendMail({
      from: mailConfig.user,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    });
  }
}
