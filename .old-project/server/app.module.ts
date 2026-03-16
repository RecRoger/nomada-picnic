import { Module } from '@nestjs/common';
import { PicnicsModule } from './api/picnics/picnics.module';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { ProductionCostsModule } from './api/production-costs/production-costs.module';
import { PlacesModule } from './api/places/places.module';
import { DatabaseModule } from './database/database.module';
import { LoggingInterceptor } from 'server/interceptors/logger.interceptor';
import { AuthModule } from './api/auth/auth.module';
import { ExpensesModule } from '../../api/src/modules/expenses/expenses.module';

@Module({
  imports: [
    DatabaseModule,
    RouterModule.register([
      {
        path: 'api',
        children: [
          { path: 'auth', module: AuthModule },
          { path: 'picnics', module: PicnicsModule },
          { path: 'costs', module: ProductionCostsModule },
          { path: 'expenses', module: ExpensesModule },
          { path: 'places', module: PlacesModule },
        ],
      },
    ]),
    PicnicsModule,
    ProductionCostsModule,
    ExpensesModule,
    PlacesModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR, // Configura APP_INTERCEPTOR
      useClass: LoggingInterceptor, // Utiliza LoggingInterceptor como interceptor global
    },
  ]
})
export class AppModule { }
