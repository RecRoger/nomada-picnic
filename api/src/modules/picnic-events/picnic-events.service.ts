import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PicnicEvent, PicnicEventDocument } from 'src/common/database/schemas/picnic-events.schema';
import { PicnicEventDto } from 'src/common/models/picnic-events.dto';

@Injectable()
export class PicnicEventsService {
  private readonly logger = new Logger(PicnicEventsService.name);

  constructor(
    @InjectModel(PicnicEvent.name)
    private readonly eventModel: Model<PicnicEventDocument>,
  ) { }

  async findEvents(query: string): Promise<PicnicEventDto[]> {
    this.logger.log('[findEvents]');
    try {
      const events: any = await this.eventModel.find().populate('recomendedAditionals').lean().exec();

      return events.map(event => ({
        ...event,
        recomendedAditionals: event.recomendedAditionals
          .map(additional => query == 'full' ? additional.name : additional._id)
      })) as unknown as PicnicEventDto[];
    } catch (err) {
      this.logger.error(` - Error finding Events: ${err.message}`, err.stack);
      throw new Error('Error al consultar eventos');
    }
  }

  async create(eventDto: PicnicEventDto): Promise<PicnicEventDto> {
    this.logger.log('[create]', eventDto.name);
    try {
      const createEvent = new this.eventModel(eventDto);
      const newEvent = (await createEvent.save()) as unknown as PicnicEventDto;
      this.logger.log('[event created]')

      return newEvent
    } catch (err) {
      this.logger.error(` - Error creating Package: ${err.message}`, err.stack);
      throw new Error('Error al crear el paquete');
    }
  }

  async update(id: string, eventDto: Partial<PicnicEventDto>): Promise<PicnicEventDto> {
    this.logger.log(`[update]`, `id: ${id}`);
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundException(`El ID '${id}' no es un ObjectId válido`);
      }
      const updatedEvent = await this.eventModel
        .findByIdAndUpdate(id, { $set: eventDto }, { new: true })
        .exec();

      if (!updatedEvent) {
        throw new NotFoundException(`Paquete de picnic con ID '${id}' no encontrado`);
      }
      this.logger.log('[event updated]')

      return { ...updatedEvent, recomendedAditionals: [] };
    } catch (err) {
      this.logger.error(` - Error updateing Event: ${err.message}`, err.stack);
      throw new Error('Error al guardar el Evento');
    }
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`El ID '${id}' no es un ObjectId válido`);
    }
    const result = await this.eventModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Evento con ID '${id}' no encontrado`);
    }
    return true;
  }
}