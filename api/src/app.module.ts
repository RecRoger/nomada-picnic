import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { PlacesModule } from 'src/modules/places/places.module';
import { join } from 'path';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ProductionCostsModule } from 'src/modules/production-costs/production-costs.module';
import { ExpensesModule } from 'src/modules/expenses/expenses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '.env'),
    }),
    DatabaseModule,
    AuthModule,
    PlacesModule,
    ProductionCostsModule,
    ExpensesModule,
  ],
})
export class AppModule { }
