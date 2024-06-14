import { Test, TestingModule } from '@nestjs/testing';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';
import * as path from 'path';
import { Response } from 'express';
import { createResponse } from 'node-mocks-http';

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

describe('MembershipController', () => {
  let controller: MembershipController;
  let service: MembershipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembershipController],
      providers: [
        {
          provide: MembershipService,
          useValue: {
            importExcel: jest.fn().mockResolvedValue(mockMemberships),
          },
        },
      ],
    }).compile();

    controller = module.get<MembershipController>(MembershipController);
    service = module.get<MembershipService>(MembershipService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('importExcel', () => {
    it('should import data from Excel and return the result', async () => {
      const res = createResponse();
      const filePath = path.join(__dirname, 'rawData', 'FitnessDataset.xlsx');
      await controller.importExcel(res as unknown as Response);

      expect(service.importExcel).toHaveBeenCalledWith(filePath);
      expect(res._getStatusCode()).toBe(201);
      expect(res._getData()).toEqual(JSON.stringify(mockMemberships));
    });
  });
});
