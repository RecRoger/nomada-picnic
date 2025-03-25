import { Module } from '@nestjs/common';
import { PicnicsModule } from './modules/picnics/picnics.module';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { ProductionCostsModule } from './modules/production-costs/production-costs.module';
import { PlacesModule } from './modules/places/places.module';
import { DatabaseModule } from './database/database.module';
import { LoggingInterceptor } from 'server/interceptors/logger.interceptor';

@Module({
  imports: [
    DatabaseModule,
    RouterModule.register([
      {
        path: 'api',
        children: [
          { path: 'picnics', module: PicnicsModule },
          { path: 'costs', module: ProductionCostsModule },
          { path: 'places', module: PlacesModule },
        ],
      },
    ]),
    PicnicsModule,
    ProductionCostsModule,
    PlacesModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR, // Configura APP_INTERCEPTOR
      useClass: LoggingInterceptor, // Utiliza LoggingInterceptor como interceptor global
    },
  ]
})
export class AppModule { }
