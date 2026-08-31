import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BookingStatus } from '@shared/enums';
import { Model } from 'mongoose';
import { Picnic, PicnicsDocument } from 'src/common/database/schemas/picnics.schema';
import { CreatePicnicDto } from 'src/common/models/create-picnic.dto';

@Injectable()
export class PicnicsService {
  private readonly logger = new Logger(PicnicsService.name)

  constructor(@InjectModel(Picnic.name) private picnicsModel: Model<PicnicsDocument>) { }

  async createPicnic(dto: CreatePicnicDto): Promise<PicnicsDocument> {
    this.logger.log('[createPicnic]', dto.clientInfo.name)

    try {
      const additionalsTotal = dto.additionals.reduce((sum, item) => sum + item.totalPrice, 0);
      const totalAmount = dto.booking.basePrice + additionalsTotal;

      const newPicnic = new this.picnicsModel({
        package: dto.booking.packageId,
        event: dto.booking.eventId,
        place: dto.booking.placeId,
        minGuest: dto.booking.minGuest,
        maxGuest: dto.booking.maxGuest,
        eventDate: new Date(dto.booking.eventDate),
        eventTime: dto.booking.eventTime,
        basePrice: dto.booking.basePrice,
        additionals: dto.additionals.map((add) => ({
          cost: add.costId,
          unitPrice: add.unitPrice,
          quantity: add.quantity,
          totalPrice: add.totalPrice,
        })),
        clientInfo: dto.clientInfo,
        totalAmount,
        status: BookingStatus.PENDING,
      });

      return newPicnic.save();

    } catch (err) {
      this.logger.error(`Error booking picnic: ${err.message}`, err.stack, PicnicsService.name);
      throw new Error('Error al guardar la reserva del picnic');
    }
  }
}
