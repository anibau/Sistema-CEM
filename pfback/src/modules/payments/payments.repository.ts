

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaymentStatus} from '../../enum/payment.status.enum';
import { CreatePaymentDto } from '../../dto/payments/createPayment.dto';
import { UpdatePaymentDto } from '../../dto/payments/updatePayment.dto';
import { Payment } from './Payment.entity';
import { Order } from '../orders/Order.entity';

@Injectable()
export class PaymentsRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}


  async createPayment(order: Order, createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepository.create({
      order,
      price: createPaymentDto.price,
      status: PaymentStatus.PENDING,
    });

    return await this.paymentRepository.save(payment);
  }

  async findPaymentById(paymentId: string): Promise<Payment | null> {
    return await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['order'],
    });
  }

    async updatePaymentStatus(payment: Payment, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
      const newStatus = updatePaymentDto.status as PaymentStatus;    

      if (!Object.values(PaymentStatus).includes(newStatus)) {
        throw new Error(`Estado de pago inválido: ${updatePaymentDto.status}`);
      }    

      if (newStatus === PaymentStatus.APPROVED && !payment.invoicePaidAt) {
        payment.invoicePaidAt = new Date();
      }
    
      payment.status = newStatus;
      
      return await this.paymentRepository.save(payment);
    }
    

  async savePayment(payment: Payment): Promise<Payment> {
    return await this.paymentRepository.save(payment);
  }

}








