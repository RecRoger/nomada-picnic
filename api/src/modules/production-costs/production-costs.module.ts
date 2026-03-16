import { Module } from '@nestjs/common';
import { ProductionCostsController } from './production-costs.controller';
import { ProductionCostsService } from './production-costs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from 'src/modules/files/files.module';
import { FilesService } from 'src/modules/files/files.service';
import { Cost, ProductionCostsSchema } from 'src/common/database/schemas/production-cost.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cost.name, schema: ProductionCostsSchema }]),
    FilesModule,
  ],
  controllers: [ProductionCostsController],
  providers: [ProductionCostsService, FilesService]
})
export class ProductionCostsModule { }
