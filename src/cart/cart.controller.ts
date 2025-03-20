import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(
    @Request() req,
    @Body() body: { productId: number; quantity: number },
  ) {
    return this.cartService.addToCart(req.user, body.productId, body.quantity);
  }

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user);
  }

  @Delete('remove/:id')
  removeFromCart(@Request() req, @Param('id') id: number) {
    return this.cartService.removeFromCart(req.user, +id);
  }

  @Delete('clear')
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user);
  }
}
