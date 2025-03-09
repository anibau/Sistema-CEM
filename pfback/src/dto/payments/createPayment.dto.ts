

import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreatePaymentDto {

  @IsUUID ()
  @IsNotEmpty ()
  order_id: string;

  @IsNumber ()
  @IsNotEmpty ()
  price: number;
  
}