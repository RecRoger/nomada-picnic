import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Picnic, PicnicsDocument } from 'src/common/database/schemas/picnics.schema';
import { PicnicDto } from 'src/common/models/picnic.dto';

@Injectable()
export class PicnicsService {
  private readonly logger = new Logger(PicnicsService.name)

  constructor(@InjectModel(Picnic.name) private picnicsModel: Model<PicnicsDocument>) { }

  async findOne(id?: string, email?: string, lastname?: string): Promise<PicnicDto> {
    this.logger.log(`[findOne] - ${id || (email + ' - ' + lastname)}`)
    if (!(id || email || lastname)) {
      this.logger.error(`Error finding picnic, no parameters`, PicnicsService.name);
      throw new Error('Error finding picnic');
    }
    if (!id) {
      return this.picnicsModel.findOne({ 'client.email': email, 'client.lastname': lastname }).exec() as unknown as PicnicDto
    }

    const picnic = await this.picnicsModel.findById(id).exec() as unknown as PicnicDto;
    if (picnic.client.email == email || (picnic.client.name).toLowerCase().includes(lastname.toLowerCase())) {
      return picnic
    }

    this.logger.error(`Picnic not found`, PicnicsService.name);
    throw new Error('Not Found 404');

  }

  async create(picnicData: PicnicDto): Promise<PicnicDto> {
    this.logger.log('[create] - ', picnicData.client?.email)
    const createdCost = new this.picnicsModel(picnicData);
    // TODO - logica y calculos

    try {
      return await createdCost.save() as unknown as PicnicDto;
    } catch (err) {
      this.logger.error(`Error creating production cost: ${err.message}`, err.stack, PicnicsService.name);
      throw new Error('Error al crear el costo de producción');
    }
  }

  async update(id: string, updatePicnicData: PicnicDto): Promise<PicnicDto> {
    this.logger.log(`[update] - ${id}`,)
    return this.picnicsModel.findByIdAndUpdate(id, updatePicnicData, { new: true }).exec() as unknown as PicnicDto;
  }

  async remove(id: string): Promise<boolean> {
    this.logger.log(`[remove] - ${id}`,)
    await this.picnicsModel.findByIdAndDelete(id).exec();
    return true
  }
}
