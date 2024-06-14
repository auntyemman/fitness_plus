import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './membership.emailService';
import * as nodemailer from 'nodemailer';
import { InternalServerErrorException } from '@nestjs/common';

// Mocking nodemailer
jest.mock('nodemailer');

describe('EmailService', () => {
  let emailService: EmailService;
  let configService: ConfigService;
  let sendMailMock: jest.Mock;

  beforeEach(async () => {
    sendMailMock = jest.fn();

    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'SMTP_SERVICE':
                  return 'gmail';
                case 'SMTP_USER':
                  return 'recipient@example.com';
                case 'SMTP_PASS':
                  return 'password';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEmail', () => {
    it('should send an email successfully', async () => {
      sendMailMock.mockResolvedValueOnce({});

      await emailService.sendEmail(
        'recipient@example.com',
        'Test Subject',
        'Test Body',
      );

      expect(sendMailMock).toHaveBeenCalledTimes(1);
      expect(sendMailMock).toHaveBeenCalledWith({
        from: '"Fitness+" <no-reply@fitnessplus.com>',
        to: 'recipient@example.com',
        subject: 'Test Subject',
        text: 'Test Body',
      });
    });

    it('should throw an InternalServerErrorException if sending email fails', async () => {
      sendMailMock.mockRejectedValueOnce(new Error('Failed to send email'));

      await expect(
        emailService.sendEmail(
          'recipient@example.com',
          'Test Subject',
          'Test Body',
        ),
      ).rejects.toThrow(InternalServerErrorException);

      expect(sendMailMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendFirstMonthReminder', () => {
    it('should send a first month reminder email', async () => {
      sendMailMock.mockResolvedValueOnce({});

      await emailService.sendFirstMonthReminder(
        'test@example.com',
        'John',
        'Premium',
        100,
        'https://fitnessplus.com/invoices/1',
      );

      expect(sendMailMock).toHaveBeenCalledTimes(1);
      expect(sendMailMock).toHaveBeenCalledWith({
        from: '"Fitness+" <no-reply@fitnessplus.com>',
        to: 'test@example.com',
        subject: 'Fitness+ Membership Reminder - Premium',
        text: `Dear John,\n\nThis is a reminder for your upcoming payment for your Premium membership. The total amount due is 100 and includes the first month's charges for any add-on services.\n\nPlease visit the following link to view your invoice: https://fitnessplus.com/invoices/1\n\nBest regards,\nFitness+`,
      });
    });
  });

  describe('sendExistingMemberReminder', () => {
    it('should send an existing member reminder email', async () => {
      sendMailMock.mockResolvedValueOnce({});

      await emailService.sendExistingMemberReminder(
        'test@example.com',
        'John',
        'Premium',
        100,
        'https://fitnessplus.com/invoices/1',
      );

      expect(sendMailMock).toHaveBeenCalledTimes(1);
      expect(sendMailMock).toHaveBeenCalledWith({
        from: '"Fitness+" <no-reply@fitnessplus.com>',
        to: 'test@example.com',
        subject: 'Fitness+ Add-On Service Reminder - Premium',
        text: `Dear John,\n\nThis is a reminder for your upcoming payment for your add-on services. The monthly amount due is 100.\n\nPlease visit the following link to view your invoice: https://fitnessplus.com/invoices/1\n\nBest regards,\nFitness+`,
      });
    });
  });
});
