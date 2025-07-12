import nodemailer from 'nodemailer';
import { redis } from '../lib/redis';
import { mailConfig } from '../../config/env';
import { generateOTP } from 'otp-generator-module';

interface EmailOptions {
  subject: string;
  to: string;
  html: string;
}


export class OTPService {

  static async setOtp(verificationToken: string): Promise<string> {
    try {
      const otp = generateOTP({ length: 6 });
      const storingOtp = await redis.set(verificationToken,otp, { px : 300000 });
      return otp;
    } catch (error) {
      throw new Error("Failed to generate OTP.");
    }
  }

  static async verifyOTP(verificationToken: string, otp: string): Promise<boolean> {
    try {
      const storedOtp = await redis.get(verificationToken);
      return storedOtp == otp;
    } catch (error) {
      throw new Error("Failed to verify OTP.")
    }
  }

  static async sendEmail(options: EmailOptions): Promise<void> {
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
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
    } catch (error) {
      throw new Error("Failed to send OTP.");
    }
  }

  static async sendOTP(email: string, otp: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: 'Your OTP Code',
      html: `<!DOCTYPE html>
            <html lang="en">
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
  }

  static async sendApprovalEmail(email: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: 'Service Registration Approved',
      html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Service Registration Approval</title>
            </head>
            <body style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2;">
                <div style="margin: 50px auto; width: 70%; padding: 20px 0;">
                    <div style="border-bottom: 1px solid #eee;">
                        <a href="#" style="font-size: 1.4em; color: #635BFF; text-decoration: none; font-weight: 600;">Slotflow</a>
                    </div>
                    <p style="font-size: 1.1em;">Hi,</p>
                    <p>Your service registration with Slotflow has been successfully approved.</p>
                    <p>You can now log in to your account and begin using our services.</p>
                    <p>We're excited to have you on board and look forward to providing you with an excellent experience.</p>
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
  }

}
