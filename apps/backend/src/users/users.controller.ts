import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@GetUser('id') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile name' })
  async updateProfile(@GetUser('id') userId: string, @Body('name') name: string) {
    return this.usersService.updateProfile(userId, name);
  }

  @Get('addresses')
  @ApiOperation({ summary: 'Get saved shipping addresses' })
  async getAddresses(@GetUser('id') userId: string) {
    return this.usersService.getAddresses(userId);
  }

  @Post('addresses')
  @ApiOperation({ summary: 'Add a new shipping address' })
  async addAddress(@GetUser('id') userId: string, @Body() data: any) {
    return this.usersService.addAddress(userId, data);
  }

  @Delete('addresses/:id')
  @ApiOperation({ summary: 'Delete shipping address' })
  async deleteAddress(@GetUser('id') userId: string, @Param('id') addressId: string) {
    return this.usersService.deleteAddress(userId, addressId);
  }
}
