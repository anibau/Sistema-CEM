import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsUUID()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
