import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard-stats')
  @ApiOperation({ summary: 'Get total revenue, order metrics, and variant popularity (Admin only)' })
  async getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('sales-trend')
  @ApiOperation({ summary: 'Get daily sales and revenue trends for last 30 days (Admin only)' })
  async getSalesTrend() {
    return this.analyticsService.getSalesTrend();
  }
}
