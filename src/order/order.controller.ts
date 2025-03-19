import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  createOrder(@Request() req) {
    return this.orderService.createOrder(req.user);
  }

  @Get()
  getOrders(@Request() req) {
    return this.orderService.getOrders(req.user);
  }

  @Get('all')
  @UseGuards(AuthGuard, RolesGuard) // ❗ Faqat admin ko‘ra oladi
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard) // ❗ Faqat admin status o‘zgartira oladi
  updateOrderStatus(@Param('id') id: number, @Body('status') status: string) {
    return this.orderService.updateOrderStatus(id, status);
  }

  @Patch('cancel/:id')
  @UseGuards(AuthGuard) // ❗ Auth bo‘lishi kerak
  cancelOrder(@Param('id') id: number, @Request() req) {
    return this.orderService.cancelOrder(id, req.user);
  }
}
