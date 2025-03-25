import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cost } from 'server/database/schemas/production-cost.schema';
import { CostDto } from 'server/models/cost.dto';

@Injectable()
export class ProductionCostsService {
  private readonly logger = new Logger(ProductionCostsService.name)

  constructor(@InjectModel(Cost.name) private costsModel: Model<Cost>) { }

  async findAll(type?: string): Promise<Cost[]> {
    this.logger.log('[findAll]')
    return !type ? this.costsModel.find().exec() : this.costsModel.find({ type }).exec();
  }

  async create(cost: CostDto): Promise<Cost> {
    this.logger.log('[create] - ', cost.name)
    const { providerCost, productionCost, earnPercentage } = cost;
    const finalPrice = providerCost + productionCost + (providerCost * (earnPercentage / 100));

    const createdCost = new this.costsModel({
      ...cost,
      finalPrice,
    });

    try {
      return await createdCost.save();
    } catch (err) {
      this.logger.error(`Error creating production cost: ${err.message}`, err.stack, ProductionCostsService.name);
      throw new Error('Error al crear el costo de producción');
    }
  }

  async update(id: string, updateCostDto: CostDto): Promise<Cost> {
    this.logger.log(`[update] - ${id}`,)
    return this.costsModel.findByIdAndUpdate(id, updateCostDto, { new: true }).exec();
  }

  async remove(id: string): Promise<boolean> {
    this.logger.log(`[remove] - ${id}`,)
    await this.costsModel.findByIdAndDelete(id).exec();
    return true
  }
}
