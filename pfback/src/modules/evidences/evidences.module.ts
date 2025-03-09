import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EvidencesController } from './evidences.controller';
import { EvidencesService } from './evidences.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryConfig } from 'src/Config/cloudinary';
import { Order } from '../orders/Order.entity';
import { Evidence } from './Evidence.entity';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([Evidence, Order]),
  forwardRef(() => OrdersModule), 

],
  controllers: [EvidencesController],
  providers: [EvidencesService, CloudinaryService, CloudinaryConfig],
   exports: [TypeOrmModule, EvidencesService],
})
export class EvidencesModule {}
