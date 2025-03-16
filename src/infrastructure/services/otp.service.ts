import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { mailConfig } from '../../config/env';

export class OTPService {
  private static otpStore: Map<string, string> = new Map();

  static generateOTP(verificationToken: string): string {
    try {
      const otp = crypto.randomInt(100000, 999999).toString();
      this.otpStore.set(verificationToken, otp);
      setTimeout(() => this.otpStore.delete(verificationToken), 300000);
      return otp;
    } catch (error) {
      throw new Error("Failed to generate OTP.");
    }
  }

  static verifyOTP(verificationToken: string, otp: string): boolean {
    try {
      const result = this.otpStore.get(verificationToken) === otp;
      return result;
    } catch (error) {
      throw new Error("Failed to verify OTP.")
    }
  }

  static async sendOTP(email: string, otp: string): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: mailConfig.user,
          pass: mailConfig.password,
        },
      });

      await transporter.sendMail({
        from: "Slotflow",
        to: email,
        subject: 'Your OTP Code',
        html: `<DOCTYPE html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>OTP Verification</title>
                </head>
                <body style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2;">
                    <div style="margin: 50px auto; width: 70%; padding: 20px 0;">
                        <div style="border-bottom: 1px solid #eee;">
                            <a href="#" style="font-size: 1.4em; color: #635BFF; text-decoration: none; font-weight: 600;">Slotflow</a>
                        </div>
                        <p style="font-size: 1.1em;">Hi,</p>
                        <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign-Up procedures. OTP is valid for 5 minutes.</p>
                        <h2 style="background: #635BFF; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${otp}</h2>
                        <p style="font-size: 0.9em;">Regards,<br />Slotflow</p>
                        <hr style="border: none; border-top: 1px solid #eee;" />
                        <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300;">
                            <p>Slotflow Inc</p>
                            <p>White clouds</p>
                            <p>Somewhere in the universe</p>
                        </div>
                    </div>
                </body>
              </html>`,
      });
    } catch (error) {
      throw new Error("Failed to send OTP.");
    }
  }
}
