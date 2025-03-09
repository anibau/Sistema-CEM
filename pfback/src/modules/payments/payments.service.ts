

import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaymentsRepository } from './payments.repository';

import { UpdatePaymentDto } from '../../dto/payments/updatePayment.dto';
import { PaymentStatus } from 'src/enum/payment.status.enum';
import { Order } from '../orders/Order.entity';
import { CreatePaymentDto } from 'src/dto/payments/createPayment.dto';
import { Payment } from './Payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}


  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const order = await this.orderRepository.findOne({ where: { id: createPaymentDto.order_id } });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${createPaymentDto.order_id} no encontrada.`);
    }

    return await this.paymentsRepository.createPayment(order, createPaymentDto);
  } 

    async updatePaymentStatus(paymentId: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
      const payment = await this.paymentsRepository.findPaymentById(paymentId);
    
      if (!payment) {
        throw new NotFoundException(`Pago con ID ${paymentId} no encontrado.`);
      }    

      if (updatePaymentDto.status === PaymentStatus.APPROVED) {
        payment.invoicePaidAt = new Date();
      }
    
      return await this.paymentsRepository.updatePaymentStatus(payment, updatePaymentDto);
    }     
    
}   




