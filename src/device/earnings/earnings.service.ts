import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Between, EntityManager, LessThanOrEqual, Like, MoreThanOrEqual } from 'typeorm';
import { DeviceEarning } from '../entities/device-earnings.entity';
import { paymentStatus, PaymentTransactions, paymentType } from '../entities/payment-transactions.entity';

@Injectable()
export class EarningsService {
  constructor(private readonly entityManager: EntityManager) {}

async getEarnings(query: any) {
    // ?fromDate=2025-06-01&toDate=2025-06-15
  try {
    const { device_id, fromDate, toDate } = query;
    const where: any = {};

    if (device_id) where.device_id= Like(`%${device_id}%`);

    if (fromDate && toDate) {
      where.createdAt = Between(new Date(fromDate), new Date(toDate));
    } else if (fromDate) {
      where.createdAt = MoreThanOrEqual(new Date(fromDate));
    } else if (toDate) {
      where.createdAt = LessThanOrEqual(new Date(toDate));
    }

    const earnings = await this.entityManager.find(DeviceEarning, { where });

    return earnings;
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException(error);
  }
}




async getPaymentHistory(query:any){
try {
    

    const { device_id, fromDate, toDate , type, status } = query;
    const where: any = {};

   if (device_id) where.deviceId= Like(`%${device_id}%`);
   if (type) where.type= Like(`%${type}%`);
   if (status) where.status= Like(`%${status}%`);

    if (fromDate && toDate) {
      where.created_at = Between(new Date(fromDate), new Date(toDate));
    } else if (fromDate) {
      where.created_at = MoreThanOrEqual(new Date(fromDate));
    } else if (toDate) {
      where.created_at = LessThanOrEqual(new Date(toDate));
    }
    const  payments = await this.entityManager.find(PaymentTransactions, { where });

    return payments;

} catch (error) {
     console.log(error);
    throw new InternalServerErrorException(error);
}
}

async getPaymentHistoryReferenceData(){

    return {
        paymentType:[Object.values(paymentType )] ,
        paymentStatus:[Object.values(paymentStatus).filter((val:any)=> typeof val != "number")]
    }
}
}
