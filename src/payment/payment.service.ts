import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Order } from 'src/order/entities/order.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  async createPayment(orderId: number, amount: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === 'cancelled') {
      throw new BadRequestException(
        'Cannot create payment for a cancelled order',
      );
    }

    const payment = this.paymentRepository.create({
      order,
      orderId,
      amount,
      status: PaymentStatus.PENDING,
    });

    await this.paymentRepository.save(payment);

    return { success: true, message: 'Payment created ✅', data: payment };
  }

  async getPaymentById(paymentId: number) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['order'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return { success: true, message: 'Payment retrieved ✅', data: payment };
  }

  async getPaymentsByOrderId(orderId: number) {
    const payments = await this.paymentRepository.find({
      where: { orderId },
      relations: ['order'],
    });

    return {
      success: true,
      message: 'Payments for order retrieved ✅',
      data: payments,
    };
  }

  async updatePaymentStatus(paymentId: number, status: PaymentStatus) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (![PaymentStatus.SUCCESSFUL, PaymentStatus.FAILED].includes(status)) {
      throw new BadRequestException('Invalid status update');
    }

    payment.status = status;
    await this.paymentRepository.save(payment);

    return {
      success: true,
      message: `Payment status updated to ${status} ✅`,
      data: payment,
    };
  }
}
