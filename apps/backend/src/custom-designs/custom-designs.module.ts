import { Module } from '@nestjs/common';
import { CustomDesignsService } from './custom-designs.service';
import { CustomDesignsController } from './custom-designs.controller';

@Module({
  providers: [CustomDesignsService],
  controllers: [CustomDesignsController],
  exports: [CustomDesignsService],
})
export class CustomDesignsModule {}
