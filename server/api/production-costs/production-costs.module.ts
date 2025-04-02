import { Module } from '@nestjs/common';
import { ProductionCostsController } from './production-costs.controller';
import { ProductionCostsService } from './production-costs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cost, ProductionCostsSchema } from 'server/database/schemas/production-cost.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cost.name, schema: ProductionCostsSchema }])],
  controllers: [ProductionCostsController],
  providers: [ProductionCostsService]
})
export class ProductionCostsModule { }
