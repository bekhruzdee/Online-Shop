import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Payment } from 'src/payment/entities/payment.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' }) 
  user: User;

  @Column()
  userId: number; 

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order, { cascade: true }) 
  payment: Payment;
  

  @Column({ default: 'pending' }) 
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
