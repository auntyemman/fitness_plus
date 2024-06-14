import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({
    type: 'varchar',
    enum: [
      'annual basic',
      'annual premium',
      'monthly basic',
      'monthly premium',
    ],
  })
  membershipType: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'date', nullable: true })
  monthlyDueDate: Date; // For add-on services

  @Column({ type: 'float' })
  totalAmount: number; // Annual or monthly amount

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'boolean', default: true })
  isFirstMonth: boolean;

  @Column({ nullable: true })
  invoiceLink: string;
}
