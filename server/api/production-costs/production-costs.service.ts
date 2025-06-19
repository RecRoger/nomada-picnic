import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilesService } from 'server/api/files/files.service';
import { Cost } from 'server/database/schemas/production-cost.schema';
import { CostDto } from 'server/models/cost.dto';

@Injectable()
export class ProductionCostsService {
  private readonly logger = new Logger(ProductionCostsService.name)

  constructor(
    @InjectModel(Cost.name) private costsModel: Model<Cost>,
    private filesService: FilesService,
  ) { }

  async findAll(type?: string): Promise<Cost[]> {
    this.logger.log('[findAll]', type)
    return !type ? this.costsModel.find().exec() : this.costsModel.find({ type }, {
      providerCost: 0,
      productionCost: 0,
      earnPercentage: 0,
    }).exec();
  }

  async create(costData: CostDto, files: Express.Multer.File[]): Promise<Cost> {
    this.logger.log('[create] - ', costData.name)
    try {
      const { providerCost, productionCost, earnPercentage } = costData;
      costData.finalPrice = (providerCost + productionCost) * (1 + (earnPercentage / 100));
      if (files && files.length > 0) {
        costData.images = this.filesService.saveFiles(files, costData.name.replaceAll(' ', '-'), 'costs')
      }

      const createdCost = new this.costsModel(costData);
      return await createdCost.save();
    } catch (err) {
      this.logger.error(`Error creating production cost: ${err.message}`, err.stack, ProductionCostsService.name);
      throw new Error('Error al crear el costo de producción');
    }
  }

  async update(id: string, costData: CostDto, files: Express.Multer.File[]): Promise<Cost> {
    this.logger.log(`[update] - ${id}`,)

    try {
      const { providerCost, productionCost, earnPercentage } = costData;
      costData.finalPrice = (providerCost + productionCost) * (1 + (earnPercentage / 100));
      if (files && files.length > 0) {
        costData.images = this.filesService.saveFiles(files, costData.name.replaceAll(' ', '-'), 'costs')
      }

      return this.costsModel.findByIdAndUpdate(id, costData, { new: true }).exec();
    } catch (err) {
      this.logger.error(`Error editing production cost: ${err.message}`, err.stack, ProductionCostsService.name);
      throw new Error('Error al actualizar el costo de producción');
    }
  }

  async remove(id: string): Promise<boolean> {
    this.logger.log(`[remove] - ${id}`,)
    await this.costsModel.findByIdAndDelete(id).exec();
    return true
  }
}
