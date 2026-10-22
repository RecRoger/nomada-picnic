import { Module } from '@nestjs/common';
import { PicnicsController } from './picnics.controller';
import { PicnicsService } from './picnics.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Picnic, PicnicsSchema } from 'src/common/database/schemas/picnics.schema';
import { Place, PlacesSchema } from 'src/common/database/schemas/places.schema';
import { MailModule } from 'src/modules/mails/mail.module';
import { GoogleCalendarService } from 'src/modules/calendar/google-calendar.service';
import { PicnicPackagesModule } from 'src/modules/picnic-packages/picnic-packages.module';
import { ProductionCostsModule } from 'src/modules/production-costs/production-costs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Picnic.name, schema: PicnicsSchema },
      { name: Place.name, schema: PlacesSchema },
    ]),
    MailModule,
    PicnicPackagesModule,
    ProductionCostsModule,
  ],
  controllers: [PicnicsController],
  providers: [PicnicsService, GoogleCalendarService]
})
export class PicnicsModule { }
