

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { Order } from './Order.entity';
/*import { OrderHistoriesModule } from '../orderHistories/orderHistories.module';*/
import { EvidencesModule } from '../evidences/evidences.module';
import { UsersModule } from '../users/users.module';
import { PaymentsModule } from '../payments/payments.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    /*forwardRef(() => OrderHistoriesModule),*/
    forwardRef(() => EvidencesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => PaymentsModule),
    forwardRef(() => NotificationsModule),
  ],

  controllers: [OrdersController], 
  providers: [OrdersService, OrdersRepository],
  
  exports: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
