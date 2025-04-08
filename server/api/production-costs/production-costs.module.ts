import { Module } from '@nestjs/common';
import { ProductionCostsController } from './production-costs.controller';
import { ProductionCostsService } from './production-costs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cost, ProductionCostsSchema } from 'server/database/schemas/production-cost.schema';
import { FilesService } from 'server/api/files/files.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cost.name, schema: ProductionCostsSchema }])],
  controllers: [ProductionCostsController],
  providers: [ProductionCostsService, FilesService]
})
export class ProductionCostsModule { }
