import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Order } from 'src/order/entities/order.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.payment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' }) // ✅ `orderId` ustuni qo‘shildi
  order: Order;

  @Column()
  orderId: number; // ✅ Foydali bo‘lishi uchun `orderId` alohida ustun sifatida qo‘shildi

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus, // ✅ `enum` sifatida belgilandi
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @CreateDateColumn()
  createdAt: Date; // ✅ `@CreateDateColumn()` orqali avtomatik vaqt qo‘shiladi
}
