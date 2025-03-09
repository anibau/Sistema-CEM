

import { Controller, Post, Patch, Param, Body} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from '../../dto/payments/createPayment.dto';
import { UpdatePaymentDto } from '../../dto/payments/updatePayment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  
  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.createPayment(createPaymentDto);  }


  @Patch(':paymentId')
  async updatePaymentStatus(@Param('paymentId') paymentId: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.updatePaymentStatus(paymentId, updatePaymentDto);
  }
}


