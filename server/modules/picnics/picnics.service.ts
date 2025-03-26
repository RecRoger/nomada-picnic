import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Picnic } from 'server/database/schemas/picnics.schema';
import { PicnicDto } from 'server/models/picnic.dto';

@Injectable()
export class PicnicsService {
  private readonly logger = new Logger(PicnicsService.name)

  constructor(@InjectModel(Picnic.name) private picnicsModel: Model<Picnic>) { }

  async findOne(id?: string, email?: string, lastname?: string): Promise<Picnic> {
    this.logger.log(`[findOne] - ${id || (email + ' - ' + lastname)}`)
    if (!(id || email || lastname)) {
      this.logger.error(`Error finding picnic, no parameters`, PicnicsService.name);
      throw new Error('Error finding picnic');
    }
    if (!id) {
      return this.picnicsModel.findOne({ 'client.email': email, 'client.lastname': lastname }).exec()
    }
    const picnic = await this.picnicsModel.findById(id).exec();

    if (picnic.client.email == email || (picnic.client.name).toLowerCase().includes(lastname.toLowerCase())) {
      return picnic
    }

    this.logger.error(`Picnic not found`, PicnicsService.name);
    throw new Error('Not Found 404');

  }

  async create(picnicData: PicnicDto): Promise<Picnic> {
    this.logger.log('[create] - ', picnicData.client?.email)
    const createdCost = new this.picnicsModel(picnicData);
    // TODO - logica y calculos

    try {
      return await createdCost.save();
    } catch (err) {
      this.logger.error(`Error creating production cost: ${err.message}`, err.stack, PicnicsService.name);
      throw new Error('Error al crear el costo de producción');
    }
  }

  async update(id: string, updatePicnicData: PicnicDto): Promise<Picnic> {
    this.logger.log(`[update] - ${id}`,)
    return this.picnicsModel.findByIdAndUpdate(id, updatePicnicData, { new: true }).exec();
  }

  async remove(id: string): Promise<boolean> {
    this.logger.log(`[remove] - ${id}`,)
    await this.picnicsModel.findByIdAndDelete(id).exec();
    return true
  }
}
