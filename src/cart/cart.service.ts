import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async addToCart(user: User, productId: number, quantity: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found ❌');

    let cartItem = await this.cartRepository.findOne({
      where: { user, product },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartRepository.create({ user, product, quantity });
    }

    await this.cartRepository.save(cartItem);
    return {
      success: true,
      message: 'Product added to cart ✅',
      data: cartItem,
    };
  }

  async getCart(user: User) {
    const cart = await this.cartRepository.find({
      where: { user },
      relations: ['product'],
    });

    return {
      success: true,
      message: 'Cart retrieved successfully ✅',
      data: {
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        cartItems: cart,
      },
    };
  }

  async removeFromCart(user: User, cartItemId: number) {
    const cartItem = await this.cartRepository.findOne({
      where: { id: cartItemId, user },
    });
    if (!cartItem) throw new NotFoundException('Cart item not found ❌');

    await this.cartRepository.remove(cartItem);
    return { success: true, message: 'Product removed from cart ✅' };
  }

  async clearCart(user: User) {
    await this.cartRepository.delete({ user });
    return { success: true, message: 'Cart cleared successfully ✅' };
  }
}
