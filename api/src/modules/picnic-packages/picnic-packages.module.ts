import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PicnicPackagesController } from './picnic-packages.controller';
import { PicnicPackageService } from './picnic-packages.service';
import { PicnicPackage, PicnicPackageSchema } from 'src/common/database/schemas/picnic-packages.schema';
import { Cost, ProductionCostsSchema } from 'src/common/database/schemas/production-cost.schema';
import { Place, PlacesSchema } from 'src/common/database/schemas/places.schema';
import { FilesService } from 'src/modules/files/files.service';
import { MailModule } from 'src/modules/mails/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PicnicPackage.name, schema: PicnicPackageSchema },
      { name: Cost.name, schema: ProductionCostsSchema },
      { name: Place.name, schema: PlacesSchema },
    ]),
    MailModule,
  ],
  controllers: [PicnicPackagesController],
  providers: [PicnicPackageService, FilesService],
})
export class PicnicPackagesModule { }