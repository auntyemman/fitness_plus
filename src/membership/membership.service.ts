import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MembershipRepository } from './membership.repository';
import { Membership } from './entities/membership.entity';
import * as fs from 'fs';
import * as XLSX from 'xlsx';

@Injectable()
export class MembershipService {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  async importExcel(filePath: string): Promise<any> {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const membership = new Membership();
      for (const data of jsonData) {
        membership.firstName = data['First Name'];
        membership.lastName = data['Last Name'];
        membership.membershipType = data['MembershipType'];
        membership.startDate = new Date(data['StartDate']);
        membership.dueDate = new Date(data['DueDate']);
        membership.totalAmount = parseFloat(data['TotalAmount']);
        membership.email = data['Email'];
        membership.isFirstMonth = data['IsFirstMonth'];

        await this.create(membership);
      }
      return await this.findAll();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(membershipData: Partial<Membership>): Promise<Membership> {
    return this.membershipRepository.create(membershipData);
  }

  async update(
    id: number,
    updateData: Partial<Membership>,
  ): Promise<Membership> {
    return this.membershipRepository.update(id, updateData);
  }

  async findById(id: number): Promise<Membership> {
    return this.membershipRepository.findById(id);
  }

  async findAll(): Promise<Membership[]> {
    return this.membershipRepository.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.membershipRepository.delete(id);
  }
}
