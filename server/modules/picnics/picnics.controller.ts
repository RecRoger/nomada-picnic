import { Controller, Get } from '@nestjs/common';
import { PicnicsService } from 'server/modules/picnics/picnics.service';

@Controller({ path: 'picnics', version: '1' })
export class PicnicsController {
  constructor(private readonly picnicsService: PicnicsService) { }

  @Get()
  getPicnic(): string {
    return this.picnicsService.getPicnic();
  }

}
