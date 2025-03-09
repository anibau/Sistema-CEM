import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../users/User.entity';
import { Order } from '../orders/Order.entity';
import { Evidence } from '../evidences/Evidence.entity';
/*import { OrderHistory } from '../orderHistories/orderHistory.entity';*/

import { Role } from 'src/enum/Role.enum';
import { EquipmentType } from 'src/enum/equipmentype.enum';
import { OrderStatus } from 'src/enum/orderstatus.enum';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Evidence)
    private readonly evidenceRepository: Repository<Evidence>,

    /*@InjectRepository(OrderHistory)*/
    /*private readonly orderHistoryRepository: Repository<OrderHistory>,*/
    private readonly dataSource: DataSource,
  ) {}

  
  async clearDatabase(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();

      // Truncate con CASCADE para evitar restricciones de FK
      await queryRunner.query(`
        TRUNCATE TABLE 
          "orderhistories", 
          "evidences", 
          "orders", 
          "users", 
          "payments", 
          "notifications"
        RESTART IDENTITY CASCADE;
      `);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }



  async seedData() {
    this.clearDatabase();
    console.log('🌱 Iniciando precarga de datos...');

    const hashedPassword = await bcrypt.hash('0123456789', 10);

    // Crear usuarios con diferentes roles
    /*
    const users = [
      this.userRepository.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        phone: '1234567890',
        role: Role.ADMIN,
        dni: 123456780
      }),
      this.userRepository.create({
        name: 'Cliente1',
        email: 'cliente1@example.com',
        password: hashedPassword,
        phone: '1234567891',
        role: Role.CLIENT,
        dni: 123456781
      }),
      this.userRepository.create({
        name: 'Cliente2',
        email: 'cliente2@example.com',
        password: hashedPassword,
        phone: '1234567892',
        role: Role.CLIENT,
        dni: 123456782
      }),
      this.userRepository.create({
        name: 'Técnico',
        email: 'tecnico@example.com',
        password: hashedPassword,
        phone: '1234567893',
        role: Role.TECHN,
        dni: 123456783
      }),
      this.userRepository.create({
        name: 'Técnico1',
        email: 'tecnico1@example.com',
        password: hashedPassword,
        phone: '1234567893',
        role: Role.TECHN,
        dni: 123456784
      }),
    ];

    const savedUsers = await this.userRepository.save(users);
   

    const [admin, client1, client2, technician, technician1] = savedUsers;
*/
    // Crear órdenes con diferentes estados y equipos
    /*
    const orders = [
      this.orderRepository.create({
        clientEmail: 'cliente2@example.com',
        clientDni: 12345678,
        equipmentType: EquipmentType.CELULAR,
        imei: '123456789012345',
        assignedTechn: technician,
        description: 'Cambio de pantalla',
        status: OrderStatus.REVISION,
        Admin: client1,
      }),
      this.orderRepository.create({
        clientEmail:  'cliente3@example.com',
        clientDni: 87654321,
        equipmentType: EquipmentType.LAPTOP,
        imei: '987654321098765',
        assignedTechn: technician,
        description: 'Reparación de teclado',
        status: OrderStatus.REVISION,
        Admin: client2,
      }),
      this.orderRepository.create({
        clientEmail: 'cliente2@example.com',
        clientDni: 12345678,
        equipmentType: EquipmentType.TABLET,
        imei: '456789012345678',
        assignedTechn: technician,
        description: 'Fallo en batería',
        status: OrderStatus.REVISION,
        Admin: client1,
      }),
      this.orderRepository.create({
        clientEmail:'cliente2@example.com',
        clientDni: 87654321,
        equipmentType: EquipmentType.CELULAR,
        imei: '321098765432109',
        assignedTechn: technician,
        description: 'Cambio de display',
        status: OrderStatus.REVISION,
        Admin: client2,
      }),
      this.orderRepository.create({
        clientEmail:  'cliente2@example.com',
        clientDni: 87654321,
        equipmentType: EquipmentType.CELULAR,
        imei: '321098765432109',
        assignedTechn: technician1,
        description: 'No enciende',
        status: OrderStatus.REVISION,
        Admin: client2,
      }),
    ];

    const savedOrders = await this.orderRepository.save(orders);
    

    // Agregar evidencias a cada orden (2 evidencias por orden)
    const fileUrl = "https://res.cloudinary.com/dc73yo3jo/image/upload/v1739028403/uaujalru4u5zznijhlxn.jpg";
    for (const order of savedOrders) {
      const evidences = [
        this.evidenceRepository.create({
          fileUrl:fileUrl,
          order,
        }),
        this.evidenceRepository.create({
          fileUrl,
          order,
        }),
      ];
      await this.evidenceRepository.save(evidences);
     
    }
    /*

    //Agregar historial de eventos a cada orden
    /*for (const order of savedOrders) {
      const orderHistories = [
        this.orderHistoryRepository.create({
          event: 'Servicio iniciado',
          order,
          createdAt: new Date('2025-02-07T12:00:00')

        }),
        
        this.orderHistoryRepository.create({
          event: 'Servicio finalizado',
          order,
          createdAt: new Date('2025-02-08T12:00:00')
        }),
        this.orderHistoryRepository.create({
          event: 'Factura pagada',
          order,
          createdAt: new Date('2025-02-09T12:00:00')
        }),
        this.orderHistoryRepository.create({
          event: `Equipo listo para entrega`,
          order,
          createdAt: new Date('2025-02-10T12:00:00')
        }),
        
      ];
      await this.orderHistoryRepository.save(orderHistories);
      console.log(`Historial creado para orden ID ${order.id}`);
    }*/

   
    return "cargada la informacion a la base de datos"
  }
}
