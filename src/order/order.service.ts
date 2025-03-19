import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartService } from 'src/cart/cart.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>,
    private readonly cartService: CartService,
  ) {}

  async createOrder(user: User) {
    const cart = await this.cartService.getCart(user);

    if (!cart || !cart.data || !cart.data.cartItems || cart.data.cartItems.length === 0) {
      throw new BadRequestException('Cart is empty!');
    }

    const order = this.orderRepository.create({
      user,
      status: 'pending',
    });

    await this.orderRepository.save(order);

    const orderItems = cart.data.cartItems.map((cartItem) => {
      return this.orderItemRepository.create({
        order,
        product: cartItem.product,
        quantity: cartItem.quantity,
      });
    });

    await this.orderItemRepository.save(orderItems);
    await this.cartService.clearCart(user);

    return {
      success: true,
      message: 'Order created successfully ✅',
      data: order,
    };
  }

  async getOrders(user: User) {
    const orders = await this.orderRepository.find({
      where: { user },
      relations: ['orderItems', 'orderItems.product'],
    });

    return { success: true, message: 'Orders retrieved ✅', data: orders };
  }

  async getAllOrders() {
    const orders = await this.orderRepository.find({
      relations: ['user', 'orderItems', 'orderItems.product'],
    });
    return { success: true, message: 'All orders retrieved ✅', data: orders };
  }

  async updateOrderStatus(id: number, status: string) {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    order.status = status;
    await this.orderRepository.save(order);

    return { success: true, message: `Order status updated to ${status}`, data: order };
  }

  async cancelOrder(id: number, user: User) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.user.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You are not allowed to cancel this order');
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      throw new BadRequestException('Order cannot be canceled');
    }

    order.status = 'cancelled';
    await this.orderRepository.save(order);

    return { success: true, message: 'Order cancelled successfully', data: order };
  }
}
