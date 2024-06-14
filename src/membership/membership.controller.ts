import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import * as path from 'path';
import { Response } from 'express';

@Controller('memberships')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post('import')
  async importExcel(@Res() res: Response): Promise<any> {
    const filePath = path.join(__dirname, 'rawData', 'FitnessDataset.xlsx');
    const result = await this.membershipService.importExcel(filePath);
    res.status(201).json(result);
  }
}
