

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EquipmentType } from '../../enum/equipmentype.enum';

export class UpdateTechicalDataDto {

  @IsEnum (EquipmentType)
  @IsNotEmpty ()
  equipmentType: EquipmentType;

  @IsString ()
  @IsNotEmpty ()
  imei: string;

  @IsString ()
  @IsNotEmpty ()
  description: string;
  
}
