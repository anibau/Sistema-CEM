

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './Payment.entity';
import { PaymentsService } from '../payments/payments.service';
import { PaymentsController } from '../payments/payments.controller';
import { PaymentsRepository } from './payments.repository';
import { OrdersModule } from '../orders/orders.module';
import { Order } from '../orders/Order.entity';


@Module ({

  imports: [TypeOrmModule.forFeature ([Payment, Order]),
  forwardRef(() => OrdersModule), 
],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository],
  exports: [PaymentsService, PaymentsRepository],

})

export class PaymentsModule {}


