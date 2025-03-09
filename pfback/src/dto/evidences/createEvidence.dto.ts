import { ApiHideProperty } from '@nestjs/swagger';
import { IsString, IsUrl, MinLength } from 'class-validator';

export class CreateEvidenceDto {
  /**
   * Id de la orden
   * @example  d7dc9d2c-a06a-4e71-9216-7151369a9535
   */
  @IsString()
  orderId: string;


  @ApiHideProperty()  // Oculta fileUrl en Swagger
  fileUrl?: string;
}
