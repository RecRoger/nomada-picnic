import { Module } from '@nestjs/common';
import { PicnicsController } from './picnics.controller';
import { PicnicsService } from './picnics.service';

@Module({
  controllers: [PicnicsController],
  providers: [PicnicsService]
})
export class PicnicsModule {}
