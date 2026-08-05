import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CostDto } from 'src/common/models/cost.dto';
import { Cost, CostDocument } from 'src/common/database/schemas/production-cost.schema';
import { FilesService } from 'src/modules/files/files.service';
import { sanitizeContent } from 'src/common/constants/html-sanitizer';

@Injectable()
export class ProductionCostsService {
  private readonly logger = new Logger(ProductionCostsService.name)

  constructor(
    @InjectModel(Cost.name) private costsModel: Model<CostDocument>,
    private filesService: FilesService,
  ) { }

  async findAll(type?: string): Promise<CostDto[]> {
    this.logger.log('[findAll]', type || 'All')
    const costsQuery = !type ? this.costsModel.find().exec() : this.costsModel.find({ type }, {
      providerCost: 0,
      productionCost: 0,
      earnPercentage: 0,
    }).exec()
    const costsList = await costsQuery as unknown as CostDto[];

    this.logger.log(`[cost found : ${costsList.length}]`);

    return costsList;
  }

  async create(cost: CostDto, files: Express.Multer.File[]): Promise<CostDto> {
    this.logger.log('[create]', cost.name)
    try {
      const { providerCost, productionCost, earnPercentage } = cost;
      cost.finalPrice = (providerCost + productionCost) * (1 + (earnPercentage / 100));
      if (files && files.length > 0) {
        cost.images = await this.filesService.saveFiles(
          files,
          cost.name.replaceAll(' ', '-'),
          'costs',
        );
      }
      if (cost.detail) {
        cost.detail = sanitizeContent(cost.detail)
      }
      const createdCost = new this.costsModel(cost);
      const savedCost = (await createdCost.save() as unknown as CostDto)
      this.logger.log('[cost created]')

      return savedCost;
    } catch (err) {
      this.logger.error(`Error creating production cost: ${err.message}`, err.stack, ProductionCostsService.name);
      throw new Error('Error al crear el costo de producción');
    }
  }

  async update(id: string, cost: CostDto, files: Express.Multer.File[]): Promise<CostDto> {
    this.logger.log(`[update]`, `id: ${id}`,)

    try {
      const { providerCost, productionCost, earnPercentage } = cost;
      cost.finalPrice = (providerCost + productionCost) * (1 + (earnPercentage / 100));
      if (files && files.length > 0) {
        cost.images = await this.filesService.saveFiles(
          files,
          cost.name.replaceAll(' ', '-'),
          'costs',
        );
      } else {
        cost.images = undefined
      }
      if (cost.detail) {
        cost.detail = sanitizeContent(cost.detail)
      }
      const update = await this.costsModel.findByIdAndUpdate(id, cost, { new: true }).exec()
      this.logger.log(`[cost updated]`)

      return cost;
    } catch (err) {
      this.logger.error(`Error editing production cost: ${err.message}`, err.stack, ProductionCostsService.name);
      throw new Error('Error al actualizar el costo de producción');
    }
  }

  async remove(id: string): Promise<boolean> {
    this.logger.log(`[remove]`, `id: ${id}`,)
    await this.costsModel.findByIdAndDelete(id).exec();
    this.logger.log('[cost removed]');
    return true
  }
}
