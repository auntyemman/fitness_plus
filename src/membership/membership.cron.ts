import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MembershipService } from './membership.service';
import { EmailService } from './membership.emailService';

@Injectable()
export class MembershipCron {
  private readonly logger = new Logger(MembershipCron.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly membershipService: MembershipService,
  ) {}

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    try {
      const memberships = await this.membershipService.findAll();
      const currentDate = new Date();

      for (const membership of memberships) {
        const dueDate = new Date(membership.dueDate);
        const reminderDate = new Date(dueDate.setDate(dueDate.getDate() - 7)); // Subtract 7 days
        const invoiceLink = `https://fitnessplus.com/invoices/${membership.id}`;
        // For new members (first month)
        if (
          membership.isFirstMonth &&
          currentDate.toDateString() <= reminderDate.toDateString()
        ) {
          await this.emailService.sendFirstMonthReminder(
            membership.email,
            membership.firstName,
            membership.membershipType,
            membership.totalAmount,
            invoiceLink,
          );
        }
        // For existing members (subsequent months)
        else if (
          !membership.isFirstMonth &&
          currentDate.toDateString() === dueDate.toDateString()
        ) {
          await this.emailService.sendExistingMemberReminder(
            membership.email,
            membership.firstName,
            membership.membershipType,
            membership.totalAmount,
            invoiceLink,
          );
        }
      }

      this.logger.debug('Daily cron job completed successfully');
    } catch (error) {
      this.logger.error('Error during cron job', error.stack);
      throw new InternalServerErrorException('Failed to run daily cron job');
    }
  }
}
