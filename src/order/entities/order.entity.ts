import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' }) // 🔹 userId maydonini yaratish uchun
  user: User;

  @Column()
  userId: number; // 🔹 endi bevosita userId ni ishlatish mumkin

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[];

  @Column({ default: 'pending' }) // pending, shipped, delivered
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
