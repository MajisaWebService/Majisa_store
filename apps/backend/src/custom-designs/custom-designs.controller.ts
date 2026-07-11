import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CustomDesignsService } from './custom-designs.service';

@ApiTags('custom-designs')
@Controller('custom-designs')
export class CustomDesignsController {
  constructor(private customDesignsService: CustomDesignsService) {}

  @Post()
  @ApiOperation({ summary: 'Save a customized T-shirt design layout' })
  async create(@Body() body: any) {
    return this.customDesignsService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a customized design layout' })
  async findOne(@Param('id') id: string) {
    return this.customDesignsService.findOne(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload custom image/logo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: any) {
    const url = await this.customDesignsService.uploadFile(file);
    return { url };
  }
}
