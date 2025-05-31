import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum paymentType {
  'terminal' = 'terminal',
  'inserted' = 'inserted',
}
export enum paymentStatus {
  'unknown' = 0,
  'succeed' = 1,
  'succeed partly' = 2,
  'rejected' = 16,
  'no connection' = 34,
  'aborted' = 53,
  'timeout' = 255,
}
export enum paymentCode {
     'payment' = 1 ,
     "check connection" = 26,
     'void transaction' = 53,
     "reconciliation transaction" = 59
}
@Entity()
export class PaymentTransactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, nullable:true })
  operationCode: string;

  @Column({ type: Number })
  amount: number;

  @Column({ type: String })
  status: string;

  @Column({ type: String })
  type: string;

  @Column({ type: Number })
  deviceId: number;

  @CreateDateColumn()
  created_at: Date;
}
