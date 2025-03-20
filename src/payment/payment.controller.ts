import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentStatus } from './entities/payment.entity';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async createPayment(@Body() body: { orderId: number; amount: number }) {
    return this.paymentService.createPayment(body.orderId, body.amount);
  }

  @Get(':id')
  async getPaymentById(@Param('id') id: number) {
    return this.paymentService.getPaymentById(id);
  }

  @Get('order/:orderId')
  async getPaymentsByOrderId(@Param('orderId') orderId: number) {
    return this.paymentService.getPaymentsByOrderId(orderId);
  }

  @Patch(':id/status')
  async updatePaymentStatus(@Param('id') id: number, @Body() body: { status: PaymentStatus }) {
    return this.paymentService.updatePaymentStatus(id, body.status);
  }
}
