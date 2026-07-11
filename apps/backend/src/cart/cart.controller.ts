import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CartService } from './cart.service';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get details of a cart' })
  @ApiQuery({ name: 'cartId', required: true })
  async findCart(@Query('cartId') cartId: string) {
    return this.cartService.findCart(cartId);
  }

  @Post('get-or-create')
  @ApiOperation({ summary: 'Get existing cart or create a new one' })
  async getOrCreateCart(@Body() body: { userId?: string | null; guestCartId?: string }) {
    return this.cartService.getOrCreateCart(body.userId || null, body.guestCartId);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add an item to the cart' })
  async addToCart(
    @Body() body: { cartId: string; variantId: string; customDesignId?: string; quantity: number },
  ) {
    return this.cartService.addToCart(body.cartId, body);
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  async updateQuantity(@Param('id') itemId: string, @Body('quantity') quantity: number) {
    return this.cartService.updateQuantity(itemId, quantity);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove cart item' })
  async removeItem(@Param('id') itemId: string) {
    return this.cartService.removeItem(itemId);
  }

  @Post('merge')
  @ApiOperation({ summary: 'Merge guest cart with user cart' })
  async mergeCarts(@Body() body: { guestCartId: string; userId: string }) {
    return this.cartService.mergeCarts(body.guestCartId, body.userId);
  }
}
