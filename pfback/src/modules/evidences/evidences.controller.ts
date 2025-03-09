import { BadRequestException, Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EvidencesService } from './evidences.service';
import { CreateEvidenceDto } from 'src/dto/evidences/createEvidence.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('evidences')
export class EvidencesController {
  constructor(private readonly evidencesService: EvidencesService) {}



@Post()
@ApiConsumes('multipart/form-data')
@ApiBody({
  description: 'Formulario para subir una evidencia con imagen',
  schema: {
    type: 'object',
    properties: {
      orderId: { type: 'string', example: 'd7dc9d2c-a06a-4e71-9216-7151369a9535' },
      image: { type: 'string', format: 'binary' }
    }
  }
})
@ApiResponse({ status: 201, description: 'Evidencia creada correctamente' })
@ApiBadRequestResponse({ description: 'Debe enviar una imagen. || order ID debe ser string' })
@ApiNotFoundResponse({ description: 'Nose encontro la ordern' })
@UseInterceptors(FileInterceptor('image'))
async createEvidence(
  @Body() createEvidenceDto: CreateEvidenceDto,
  @UploadedFile() file: Express.Multer.File,
) {
  console.log(createEvidenceDto);
  if (!file) {
    throw new BadRequestException('Debe enviar una imagen.');
  }
  return this.evidencesService.createEvidenceWithImage(createEvidenceDto, file);
}

  @Get()
  getEvidences(){
      return this.evidencesService.getEvidences();
  }

  @Get(':id')
  getEvidencesByOrderId(@Param('id') id: string){
     
      return this.evidencesService.getEvidencesById(id)
      
  }

  @ApiResponse({ status: 200, description: 'Evidencia eliminada correctamente' })
  @Delete(':id')
  async deleteEvidence(@Param('id') id: string) {
    return this.evidencesService.deleteEvidence(id);
  }
}


