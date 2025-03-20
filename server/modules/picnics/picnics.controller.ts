import { Controller, Get } from '@nestjs/common';
import { PicnicsService } from 'server/modules/picnics/picnics.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
@Controller({ version: '1' })
@ApiTags('Picnics')
export class PicnicsController {
  constructor(private readonly picnicsService: PicnicsService) { }

  @Get()
  @ApiOperation({ summary: 'Consulta algun picnic' })
  getPicnic(): string {
    return this.picnicsService.getPicnic();
  }

}
