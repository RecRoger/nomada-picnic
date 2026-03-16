import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

export type PicnicsDocument = HydratedDocument<Picnic>

@Schema()
export class Picnic {
  @Prop({ type: Object })
  client: {
    name: string;
    email: string;
    phone: string;
  };

  @Prop({ type: Object })
  event: {
    description: string;
    guestsAmount: number;
    date: Date;
    extraHours: number;
    place: mongoose.Types.ObjectId
    newPlace: {
      address: string;
      zone: number
    };
    boardText: string;
  };

  @Prop({ type: Object })
  basicProduction: {
    promoIndicator: boolean;
    blanketsAmount: number;
    tableAmount: number;
    bigTableIndicator: boolean;
    archIndicator: boolean;
    gifts: [{
      item: mongoose.Types.ObjectId,
      amount: number
    }]
    basicCost: {
      productionCost: number;
      transportationCost: number;
      giftCost: number;
    };
    basicEarnPercentage: number;
    basicPrice: number;
  };

  @Prop({ type: Object })
  additionals: {
    items: [{
      item: mongoose.Types.ObjectId,
      amount: number
    }]
    additionalCost: number;
    additionalEarnPercentage: number;
    additionalPrice: number;
  };

  @Prop({ type: Object })
  food: {
    foods: [{
      item: mongoose.Types.ObjectId,
      amount: number
    }];
    foodCost: number;
    foodEarnPercentage: number;
    foodPrice: number;
  };
}

export const PicnicsSchema = SchemaFactory.createForClass(Picnic);