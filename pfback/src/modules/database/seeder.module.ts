import { Module } from '@nestjs/common';

import { SeedService } from './seeder.service';

import { SeedController } from './seeder.controller';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/orders.module';
import { EvidencesModule } from '../evidences/evidences.module';
/*import { OrderHistoriesModule } from '../orderHistories/orderHistories.module';
import { OrdersHistoriesRepository } from '../orderHistories/orderHistories.repository';*/

@Module({
  imports: [UsersModule, OrdersModule, EvidencesModule/*, OrderHistoriesModule*/],
  controllers: [SeedController],
  providers: [SeedService/*, OrdersHistoriesRepository*/],
})
export class DatabaseModule {}
