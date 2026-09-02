import { Module } from '@nestjs/common';
import { PicnicsController } from './picnics.controller';
import { PicnicsService } from './picnics.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Picnic, PicnicsSchema } from 'src/common/database/schemas/picnics.schema';
import { PicnicPackage, PicnicPackageSchema } from 'src/common/database/schemas/picnic-packages.schema';
import { Place, PlacesSchema } from 'src/common/database/schemas/places.schema';
import { MailModule } from 'src/modules/mails/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Picnic.name, schema: PicnicsSchema },
      { name: PicnicPackage.name, schema: PicnicPackageSchema },
      { name: Place.name, schema: PlacesSchema },
    ]),
    MailModule,
  ],
  controllers: [PicnicsController],
  providers: [PicnicsService]
})
export class PicnicsModule { }
