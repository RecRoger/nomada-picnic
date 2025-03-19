import { Module } from '@nestjs/common';
import { PicnicsModule } from './modules/picnics/picnics.module';
import { RouterModule } from '@nestjs/core';
import { ProvidersModule } from './modules/providers/providers.module';
import { PlacesModule } from './modules/places/places.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    RouterModule.register([
      {
        path: 'api',
        children: [
          { path: 'picnics', module: PicnicsModule },
          { path: 'providers', module: ProvidersModule },
          { path: 'places', module: PlacesModule },
        ],
      },
    ]),
    PicnicsModule,
    ProvidersModule,
    PlacesModule,
  ],
})
export class AppModule { }
