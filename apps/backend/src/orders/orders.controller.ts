import { Controller, Get, Post, Put, Body, Param, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role, OrderStatus } from '@prisma/client';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new order' })
  async create(@Body() body: any) {
    return this.ordersService.createOrder(body.userId || null, body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of an order' })
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Get('user/:userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get orders of a user' })
  async findUserOrders(@Param('userId') userId: string, @GetUser('id') currentUserId: string) {
    if (userId !== currentUserId) {
      throw new ForbiddenException('You can only view your own orders');
    }
    return this.ordersService.findUserOrders(userId);
  }

  @Get('admin/all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  async findAllOrders() {
    return this.ordersService.findAllOrders();
  }

  @Put(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
    @Body('trackingNumber') trackingNumber?: string,
  ) {
    return this.ordersService.updateStatus(id, status, trackingNumber);
  }
}
