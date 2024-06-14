import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './entities/membership.entity';

@Injectable()
export class MembershipRepository {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipModel: Repository<Membership>,
  ) {}

  async create(membershipData: Partial<Membership>): Promise<Membership> {
    const membership = this.membershipModel.create(membershipData);
    return await this.membershipModel.save(membership);
  }

  async update(
    id: number,
    updateData: Partial<Membership>,
  ): Promise<Membership> {
    await this.membershipModel.update(id, updateData);
    return this.findById(id);
  }

  async findById(id: number): Promise<Membership> {
    return this.membershipModel.findOneBy({ id });
  }

  async findAll(): Promise<Membership[]> {
    return this.membershipModel.find();
  }

  async delete(id: number): Promise<void> {
    await this.membershipModel.delete(id);
  }
}
