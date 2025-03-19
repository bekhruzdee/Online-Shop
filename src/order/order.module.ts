import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartModule } from 'src/cart/cart.module'; // 🟢 CartModule ni import qilamiz

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    CartModule, // 🟢 CartModule qo'shildi
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
