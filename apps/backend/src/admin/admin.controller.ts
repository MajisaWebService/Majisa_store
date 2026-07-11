import { Controller, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('customers')
  @ApiOperation({ summary: 'Get all active customers (Admin only)' })
  async getCustomers() {
    return this.adminService.getCustomers();
  }

  @Put('users/:id/role')
  @ApiOperation({ summary: 'Update a user role (Admin only)' })
  async updateUserRole(@Param('id') id: string, @Body('role') role: Role) {
    return this.adminService.updateUserRole(id, role);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Deactivate a customer account (Admin only)' })
  async deactivateUser(@Param('id') id: string) {
    return this.adminService.deactivateUser(id);
  }
}
