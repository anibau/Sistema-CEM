

import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../../enum/orderstatus.enum';

export class UpdateStatusDto {

  @IsEnum (OrderStatus)
  @IsNotEmpty ()
  status: OrderStatus;
  
}
