import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get<string>('SMTP_SERVICE'),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    const mailOptions = {
      from: '"Fitness+" <no-reply@fitnessplus.com>',
      to,
      subject,
      text: body,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.debug(`Email sent to ${to}`);
    } catch (error) {
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async sendFirstMonthReminder(
    to: string,
    firstName: string,
    membershipType: string,
    totalAmount: number,
    invoiceLink: string,
  ): Promise<void> {
    const subject = `Fitness+ Membership Reminder - ${membershipType}`;
    const body = `Dear ${firstName},\n\nThis is a reminder for your upcoming payment for your ${membershipType} membership. The total amount due is ${totalAmount} and includes the first month's charges for any add-on services.\n\nPlease visit the following link to view your invoice: ${invoiceLink}\n\nBest regards,\nFitness+`;
    await this.sendEmail(to, subject, body);
  }

  async sendExistingMemberReminder(
    to: string,
    firstName: string,
    membershipType: string,
    totalAmount: number,
    invoiceLink: string,
  ): Promise<void> {
    const subject = `Fitness+ Add-On Service Reminder - ${membershipType}`;
    const body = `Dear ${firstName},\n\nThis is a reminder for your upcoming payment for your add-on services. The monthly amount due is ${totalAmount}.\n\nPlease visit the following link to view your invoice: ${invoiceLink}\n\nBest regards,\nFitness+`;
    await this.sendEmail(to, subject, body);
  }
}
