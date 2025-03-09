import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEvidenceDto } from 'src/dto/evidences/createEvidence.dto';
import { Evidence } from './Evidence.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { OrdersService } from '../orders/orders.service';
import { validate as isUUID } from 'uuid';

@Injectable()
export class EvidencesService {
  constructor(
    @InjectRepository(Evidence)
    private evidenceRepository: Repository<Evidence>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly ordersService: OrdersService,
  ) { }

  async createEvidenceWithImage(
    createEvidenceDto: CreateEvidenceDto,
    file: Express.Multer.File,
  ) {
    if (!isUUID(createEvidenceDto.orderId)) {
      throw new BadRequestException(`El Order ID (${createEvidenceDto.orderId}) no es un UUID válido.`);
    }
    // Buscar la orden en la base de datos
    const order = await this.ordersService.getOrderById(createEvidenceDto.orderId)

    if (!order) {
      throw new NotFoundException(` Nose encontro la order: ${createEvidenceDto.orderId} .`);
    }
    const saveFile = await this.cloudinaryService.upladImage(file); //subimos la imagen
    createEvidenceDto.fileUrl = saveFile.secure_url;

    // 📝 Crear la evidencia con la relación a la orden
    const newEvidence = this.evidenceRepository.create({
      fileUrl: saveFile.secure_url,
      order, 
    });

    return this.evidenceRepository.save(newEvidence);

  }

  createEvidence(createEvidenceDto: CreateEvidenceDto) {
    console.log('desde guardar: ');
    console.log(createEvidenceDto);

    return this.evidenceRepository.save(createEvidenceDto);
  }

  getEvidences() {
    return this.evidenceRepository.find();
  }

  async getEvidencesById(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(`El ID proporcionado (${id}) no es un UUID válido.`);
    }

    return await this.evidenceRepository.findOne({
      where : {id},
    })
  }

  async deleteEvidence(id: string): Promise<{ message: string }> {
    // Buscar la evidencia en la base de datos
    if (!isUUID(id)) {
      throw new BadRequestException(`El  ID (${id}) no es un UUID válido.`);
    }
    const evidence = await this.evidenceRepository.findOne({ where: { id } });

    if (!evidence) {
      throw new NotFoundException(`Evidencia con ID ${id} no encontrada`);
    }

    // Extraer el publicId de la URL de Cloudinary
    const fileUrlParts = evidence.fileUrl.split('/');
    const fileName = fileUrlParts[fileUrlParts.length - 1]; // Obtener "cxip7ol1lnio15lfic3x.jpg"
    const publicId = fileName.split('.')[0]; // Removemos la extensión ".jpg"

    console.log(`Eliminando imagen de Cloudinary con publicId: ${publicId}`);

    // Borrar la imagen en Cloudinary
    await this.cloudinaryService.deleteImage(publicId);

    // Borrar la evidencia de la base de datos
    await this.evidenceRepository.delete(id);

    return { message: 'Evidencia eliminada correctamente' };
  }
}
