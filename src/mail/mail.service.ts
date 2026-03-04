import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const port = Number(this.configService.get<number>('SMTP_PORT'));
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: port,
      secure: port === 465, // Use true for 465, false for 587
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendPasswordResetEmail(email: string, token: string, name: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const resetLink = `${frontendUrl}/auth/reset-password?token=${token}`;

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #2563eb; margin-bottom: 24px;">Password Reset Request</h2>
        <p>Hello ${name || 'there'},</p>
        <p>You requested a password reset for your account. Click the button below to set a new password:</p>
        <div style="margin: 32px 0;">
          <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #64748b; font-size: 14px;">If you didn't request this, you can safely ignore this email. The link will expire in 1 hour.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">Roman Noris — Portfolio Drive</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to: email,
      subject: 'NORIS | Password Reset Request',
      html,
    });
  }

  async sendContactNotification(data: {
    name: string;
    email: string;
    phone: string;
    interest: string;
    dynamicField?: string;
    projectDetails: string;
  }) {
    const adminEmail = this.configService.get<string>('SMTP_FROM_EMAIL') || this.configService.get<string>('SMTP_USER');

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #2563eb; margin-bottom: 24px;">New Contact Inquire</h2>
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Interest:</strong> ${data.interest}</p>
          ${data.dynamicField ? `<p><strong>Details:</strong> ${data.dynamicField}</p>` : ''}
        </div>
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 16px; color: #1e293b;">Project Description:</h3>
          <p style="white-space: pre-wrap; color: #475569;">${data.projectDetails}</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">Roman Noris — Portfolio Drive</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to: adminEmail,
      subject: `NEW INQUIRY: ${data.name} - ${data.interest}`,
      html,
    });
  }
}
