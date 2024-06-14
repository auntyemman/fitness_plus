import { Test, TestingModule } from '@nestjs/testing';
import { MembershipService } from './membership.service';
import { MembershipRepository } from './membership.repository';
import { InternalServerErrorException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { Membership } from './entities/membership.entity';

// Mock data
const mockMemberships = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    membershipType: 'Premium',
    startDate: new Date('2023-01-01'),
    dueDate: new Date('2023-12-31'),
    totalAmount: 100,
    email: 'john.doe@example.com',
    isFirstMonth: false,
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    membershipType: 'Basic',
    startDate: new Date('2023-01-01'),
    dueDate: new Date('2023-12-31'),
    totalAmount: 50,
    email: 'jane.doe@example.com',
    isFirstMonth: true,
  },
];

describe('MembershipService', () => {
  let membershipService: MembershipService;
  let membershipRepository: jest.Mocked<MembershipRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipService,
        {
          provide: MembershipRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn().mockResolvedValue(mockMemberships),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    membershipService = module.get<MembershipService>(MembershipService);
    membershipRepository = module.get<MembershipRepository>(
      MembershipRepository,
    ) as jest.Mocked<MembershipRepository>;
  });

  it('should be defined', () => {
    expect(membershipService).toBeDefined();
  });

  describe('importExcel', () => {
    it('should import memberships from an Excel file', async () => {
      const mockWorkbook = {
        SheetNames: ['Sheet1'],
        Sheets: {
          Sheet1: [
            {
              'First Name': 'John',
              'Last Name': 'Doe',
              MembershipType: 'Premium',
              StartDate: '2023-01-01',
              DueDate: '2023-12-31',
              TotalAmount: '100',
              Email: 'john.doe@example.com',
              IsFirstMonth: false,
            },
            {
              'First Name': 'Jane',
              'Last Name': 'Doe',
              MembershipType: 'Basic',
              StartDate: '2023-01-01',
              DueDate: '2023-12-31',
              TotalAmount: '50',
              Email: 'jane.doe@example.com',
              IsFirstMonth: true,
            },
          ],
        },
      };

      jest.spyOn(XLSX, 'readFile').mockReturnValue(mockWorkbook);
      jest
        .spyOn(XLSX.utils, 'sheet_to_json')
        .mockReturnValue(mockWorkbook.Sheets.Sheet1);

      const result = await membershipService.importExcel('path/to/file.xlsx');
      expect(result).toEqual(mockMemberships);
      expect(membershipRepository.create).toHaveBeenCalledTimes(2);
    });

    it('should throw an InternalServerErrorException if import fails', async () => {
      jest.spyOn(XLSX, 'readFile').mockImplementation(() => {
        throw new Error('File not found');
      });

      await expect(
        membershipService.importExcel('path/to/file.xlsx'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('create', () => {
    it('should create a new membership', async () => {
      const newMembership = {
        firstName: 'Alice',
        lastName: 'Smith',
        membershipType: 'Standard',
        startDate: new Date('2023-01-01'),
        dueDate: new Date('2023-12-31'),
        totalAmount: 75,
        email: 'alice.smith@example.com',
        isFirstMonth: true,
      };

      membershipRepository.create.mockResolvedValue(
        newMembership as Membership,
      );

      const result = await membershipService.create(newMembership);
      expect(result).toEqual(newMembership);
      expect(membershipRepository.create).toHaveBeenCalledWith(newMembership);
    });
  });

  describe('update', () => {
    it('should update an existing membership', async () => {
      const updatedMembership = {
        ...mockMemberships[0],
        firstName: 'Johnny',
      };

      membershipRepository.update.mockResolvedValue(
        updatedMembership as Membership,
      );

      const result = await membershipService.update(1, { firstName: 'Johnny' });
      expect(result).toEqual(updatedMembership);
      expect(membershipRepository.update).toHaveBeenCalledWith(1, {
        firstName: 'Johnny',
      });
    });
  });

  describe('findById', () => {
    it('should find a membership by ID', async () => {
      membershipRepository.findById.mockResolvedValue(
        mockMemberships[0] as Membership,
      );

      const result = await membershipService.findById(1);
      expect(result).toEqual(mockMemberships[0]);
      expect(membershipRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('findAll', () => {
    it('should return all memberships', async () => {
      const result = await membershipService.findAll();
      expect(result).toEqual(mockMemberships);
      expect(membershipRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a membership by ID', async () => {
      membershipRepository.delete.mockResolvedValue(undefined);

      await membershipService.delete(1);
      expect(membershipRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
