import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { MembershipRepository } from './membership.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { MembershipCron } from './membership.cron';
import { EmailService } from './membership.emailService';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Membership])],
  controllers: [MembershipController],
  providers: [
    MembershipService,
    MembershipRepository,
    MembershipCron,
    EmailService,
    ConfigService,
  ],
})
export class MembershipModule {}
