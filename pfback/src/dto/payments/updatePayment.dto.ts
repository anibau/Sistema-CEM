

import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdatePaymentDto {

  @IsIn (['APPROVED']) 
  @IsNotEmpty ()
  status: string;

}

