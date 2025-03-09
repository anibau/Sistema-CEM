/*import { Type } from 'class-transformer';
import { IsUUID, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderHistoriesDto {
  @IsUUID()
  @IsNotEmpty()
  readonly orderId: string;

  @IsString()
  @IsNotEmpty()
  readonly event: string;

  @IsOptional()
  @Type(() => Date)
  readonly createdAt?: Date;
}*/
