

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { OrdersRepository } from './orders.repository';
import { UsersRepository } from '../users/users.repository';
import { CreateOrderDto } from '../../dto/orders/createOrder.dto';
import { Order } from './Order.entity';
import { UpdateOrderDto } from 'src/dto/orders/updateOrder.dto';
/*import { UpdateStatusDto } from '../../dto/orders/updateTechStatus.dto';*/
/*import { UpdateTechicalDataDto } from 'src/dto/orders/updateTechData.dto';*/
/*import { EquipmentType } from 'src/enum/equipmentype.enum';
import { OrderStatus } from 'src/enum/orderstatus.enum';
import { User } from '../users/User.entity';*/
import { Role } from 'src/enum/Role.enum';
import { NotificationsRepository } from '../notifications/notifications.repository';
/*import { OrderHistoriesService } from '../orderHistories/orderHistories.service';*/
/*import { PaymentsService } from '../payments/payments.service';*/

@Injectable ()

export class OrdersService {

  constructor (
    private readonly ordersRepository: OrdersRepository,
    private readonly usersRepository: UsersRepository,
    private readonly notificationRepository: NotificationsRepository

    /*private readonly orderHistoriesService: OrderHistoriesService,*/

  ) {}

  async getAllOrders (): Promise<Order []> {

    return this.ordersRepository.getAllOrders ();

  }

  async getOrdersByClientEmail (clientEmail: string): Promise<Order []> {

    return this.ordersRepository.getOrdersByClientEmail (clientEmail);

  }

  async getOrdersByTechnId (id: string): Promise<Order []> {

    return this.ordersRepository.getOrdersByTechnId (id);

  }

  async getOrderById (id: string): Promise<Order> {

    return this.ordersRepository.getOrderById (id);

  }

  /*async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { assignedTechnicianId, userId, clientId } = createOrderDto;

    const client = await this.usersRepository.findByRole(clientId, Role.CLIENT);
    if (!client) throw new NotFoundException('Cliente no encontrado.');

    const assignedTechnician = await this.usersRepository.findByRole(
      assignedTechnicianId,
      Role.TECHN,
    );
    if (!assignedTechnician)
      throw new NotFoundException('Técnico no encontrado.');

    const admin = await this.usersRepository.findByRole(userId, Role.ADMIN);
    if (!admin)
      throw new NotFoundException(
        'El usuario que crea la orden debe ser un administrador.',
      );

    const defaultUser: User = {
      id: 'N/A',
      name: 'No asignado',
      email: 'no-asignado@example.com',
      dni: 99999999,

      password: 'default',
      phone: '000000000',
      role: 'unknown',
      createdAt: new Date(),
      orders: [],
    };

    const orderData: Partial<Order> = {
      clientEmail: client?.email ?? 'No asignado',

      clientDni: client?.dni ?? 99999999,
      assignedTechnician: assignedTechnician ?? defaultUser,
      user: admin ?? defaultUser,
      equipmentType: EquipmentType.EQUIPO,

      imei: '000000000000000',
      description: '[Editar ...]',
      status: OrderStatus.ACTUALIZAR,
      isActive: true,
      statusHistory: [],
    };

    const newOrder = await this.ordersRepository.createOrder(orderData);
    return await this.ordersRepository.saveOrder1(newOrder);
  }*/

  /***********/

  async createOrder (createOrderDto: CreateOrderDto): Promise<Order> {

    const { clientEmail, clientDni, technName, equipmentType, imei, description, status, adminName  } = createOrderDto;

    const assignedTechnician = await this.usersRepository.findByRole (technName, Role.TECHN);

    if (!assignedTechnician)

      throw new NotFoundException ('Técnico no encontrado.');

    const admin = await this.usersRepository.findByRole (adminName, Role.ADMIN);

    if (!admin)

      throw new NotFoundException ('El usuario que crea la orden debe ser un administrador.');

    const currentDate = new Date ();

    const orderData: Partial<Order> = {

      clientEmail: clientEmail || '',
      clientDni: clientDni || null,
      assignedTechn: assignedTechnician,
      equipmentType: equipmentType || null,
      imei: imei || '',
      description: description || '',
      status: status || null,
      statusHistory: [],
      statusWithDate: status ? { status: status, date: currentDate } : null,
      isActive: true,
      Admin: admin,

    };

    const newOrder = await this.ordersRepository.createOrder (orderData);

    if(!newOrder){
      throw new BadRequestException('error al crear la orden')
    }
    await this.ordersRepository.saveOrder1 (newOrder)
    await this.notificationRepository.notifyStatusChange(newOrder);
     console.log(`📧 Notificación de estado ${newOrder.status} enviada con éxito.`);
    return newOrder;

  }

  /***********/

  /***********/

  async updateOrder (id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {

    const order = await this.ordersRepository.getOrderById (id);

    if (!order) {

      throw new NotFoundException (`Orden con ID ${id} no encontrada.`);

    }

    const { isActive: _isActive, createdAt: __createdAt,...allowedUpdates } = updateOrderDto;

    if (allowedUpdates.status) {

      const now = new Date ();

      order.statusWithDate = {

        status: allowedUpdates.status,
        date: now,

      };

      order.statusHistory.push ({

        status: allowedUpdates.status,

        date: now,

      });
    }
    Object.assign (order, allowedUpdates);
    console.log(`📌 Estado después de guardar en DB: ${order.status}`);
    return await this.ordersRepository.saveOrder1 (order);

  }

  async updateOrderWithNotification(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updatedOrder = await this.updateOrder(id, updateOrderDto);
    if (updateOrderDto.status) {
        await this.notificationRepository.notifyStatusChange(updatedOrder);
        console.log("📧 Notificación de estado enviada con éxito.");
    }

    return updatedOrder;
}



  /***********/

  /*async updateTechnicalData(
    id: string,
    updateTechnicalDataDto: UpdateTechicalDataDto,
  ): Promise<Order> {
    const order = await this.ordersRepository.getOrderById(id);

    if (!order) throw new NotFoundException(`Orden con ID ${id} no encontrada`);

    if (!order.assignedTechnician?.id) {
      throw new ForbiddenException(
        'La orden no tiene un técnico asignado o no se puede verificar.',
      );
    }

    await this.ordersRepository.saveOrder(id, updateTechnicalDataDto);
    return this.ordersRepository.getOrderById(id);
  }*/

  /*async updateOrderStatus(
    id: string,
    updateStatusDto: UpdateStatusDto,
  ): Promise<Order> {
    const order = await this.ordersRepository.getOrderById(id);
    if (!order) throw new NotFoundException(`Orden con ID ${id} no encontrada`);

    if (!order.assignedTechnician) {
      throw new ForbiddenException('La orden no tiene un técnico asignado.');
    }

    if (!order.statusHistory) {
      order.statusHistory = [];
    }

    const statusRecord = {
      [updateStatusDto.status]: new Date()
        .toISOString()
        .replace('T', ' ')
        .split('.')[0],
    };

    order.statusHistory.push(statusRecord);

    await this.orderHistoriesService.registerEvent(id, updateStatusDto.status);

    return this.ordersRepository.updateOrderStatus(
      id,
      updateStatusDto.status,
      order.statusHistory,
    );
  }*/

  async inactiveDelete (

    id: string,
    { isActive }: UpdateOrderDto,

  ): Promise<{ message: string }> {

    const order = await this.ordersRepository.findOrderById (id);

    if (!order)

      throw new NotFoundException (`Orden con ID ${id} no encontrada.`);

    if (order.isActive && isActive === false) {

      await this.ordersRepository.updateOrder (id, { isActive: false });

      return {

        message: `Orden con ID ${id} ha sido inactivada correctamente.`,

      };

    }

    throw new BadRequestException (`No se puede reactivar una orden inactiva.`);

  }

}
