import { Test, TestingModule } from '@nestjs/testing';
import { MembershipCron } from './membership.cron';
import { MembershipService } from './membership.service';
import { EmailService } from './membership.emailService';
import { InternalServerErrorException } from '@nestjs/common';
import { Membership } from './entities/membership.entity';

// Mocking membership data
const mockMemberships = [
  {
    id: 1,
    email: 'test1@example.com',
    firstName: 'John',
    membershipType: 'Premium',
    totalAmount: 100,
    dueDate: new Date(),
    isFirstMonth: false,
  },
  {
    id: 2,
    email: 'test2@example.com',
    firstName: 'Jane',
    membershipType: 'Annual Basic',
    totalAmount: 50,
    dueDate: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 days ago
    isFirstMonth: true,
  },
] as Membership[];

describe('MembershipCron', () => {
  let cronService: MembershipCron;
  let membershipService: MembershipService;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipCron,
        {
          provide: MembershipService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendFirstMonthReminder: jest.fn().mockResolvedValue(undefined),
            sendExistingMemberReminder: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    cronService = module.get<MembershipCron>(MembershipCron);
    membershipService = module.get<MembershipService>(MembershipService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should send reminders for memberships', async () => {
    // Setup the mock for this specific test
    jest
      .spyOn(membershipService, 'findAll')
      .mockResolvedValueOnce(mockMemberships);

    await cronService.handleCron();

    // Verify that membershipService.findAll() was called once
    expect(membershipService.findAll).toHaveBeenCalledTimes(1);

    // Verify that sendFirstMonthReminder and sendExistingMemberReminder were called with correct arguments
    expect(emailService.sendFirstMonthReminder).toHaveBeenCalledWith(
      'test2@example.com',
      'Jane',
      'Annual Basic',
      50,
      'https://fitnessplus.com/invoices/2',
    );
    expect(emailService.sendExistingMemberReminder).toHaveBeenCalledWith(
      'test1@example.com',
      'John',
      'Premium',
      100,
      'https://fitnessplus.com/invoices/1',
    );
  });

  it('should handle errors gracefully', async () => {
    // Setup the mock to throw an error for this specific test
    jest
      .spyOn(membershipService, 'findAll')
      .mockRejectedValueOnce(new Error('Database connection failed'));

    // Expect InternalServerErrorException to be thrown
    await expect(cronService.handleCron()).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
