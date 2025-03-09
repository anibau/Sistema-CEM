

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Order } from './Order.entity';
import { OrderStatus } from 'src/enum/orderstatus.enum';
import { UpdateTechicalDataDto } from '../../dto/orders/updateTechData.dto';
import { UpdateOrderDto } from 'src/dto/orders/updateOrder.dto';
/*import { CreateOrderDto } from 'src/dto/orders/createOrder.dto';*/
import { NotificationsRepository } from '../notifications/notifications.repository';

@Injectable ()

export class OrdersRepository  {

  constructor (private readonly entityManager: EntityManager,

    @InjectRepository (Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly notificationRepository: NotificationsRepository

  ) {} 

  async getAllOrders (): Promise<Order []> {

    return this.ordersRepository.find({
      relations: { payments: true },
    });

  }

  async getOrdersByClientEmail (clientEmail: string): Promise<Order []> {

    return this.ordersRepository.find ({ where: { clientEmail }, relations: ['payments'] });

  }

  /*async getOrdersByTechnId (assignedTechnicianId: string): Promise<Order []> {

    return this.ordersRepository.find ({

      where: { assignedTechnician: { id: assignedTechnicianId } }, 
      relations: ['assignedTechnician'], 
      
    });

  }*/

  /*********/

  async getOrdersByTechnId(id: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: {
        assignedTechn: {
          id: id, // Aquí debes usar el id del técnico
        },
      },
      relations: ['assignedTechn', 'Admin'],
    });
  }
  

  /*********/

  /*async getByStatus(status: string): Promise<Order[]> {
    const orderStatus = status as OrderStatus;
    return this.ordersRepository.find({ where: { status: orderStatus } });
  }*/

  /*async getOrderById(id: string): Promise<Order | null> {
    return this.ordersRepository.findOne({
      where: { id }, 
      relations: ['nameTech', 'Admin'],
    });   
  }*/

  /*********/

  async getOrderById (id: string): Promise<Order | null> {

    return this.ordersRepository.findOne ({

      where: { id },
      relations: ['assignedTechn', 'Admin'], 

    });

  }  

  /*********/  

  async createOrder (orderData: Partial<Order>): Promise<Order> {

    const order = this.entityManager.create (Order, orderData); 
    return order;

  }
    
  async updateOrderStatus (

    id: string, 
    status: OrderStatus, 
    statusHistory: { [key: string]: string } []

  ): Promise<Order | null> {

    const order = await this.getOrderById (id);
    if (!order) return null;


  //* Si el estado es diferente al actual, procedemos a actualizar y notificar
  if (order.status !== status) {
    order.status = status;
    await this.ordersRepository.save(order);

    // Notificar solo si hay un cambio real de estado
    await this.notificationRepository.notifyStatusChange(order);
    console.log('se envio el email al cliente')
  }
  //* fin de logica para noticar al actualizar el estado


    await this.ordersRepository.update (id, { status, statusHistory });  
    return this.getOrderById (id);

  }       

  async findOrderById (id: string): Promise<Order | null> {

    return this.ordersRepository.findOne ({ where: { id } });
    
  }

  async saveOrder (id: string, updateTechnicalDataDto: UpdateTechicalDataDto): Promise<Order> {

    await this.ordersRepository.update (id, updateTechnicalDataDto);
    return this.ordersRepository.findOne ({ where: { id } });  
  
  }   


  async saveOrder1 (order: Order): Promise<Order> {

    return await this.entityManager.save (order);

  }  
  
  async updateOrder (id: string, updateData: Partial<Order>): Promise<Order> {

    await this.ordersRepository.update (id, updateData);
    return this.ordersRepository.findOne ({ where: { id } });
    
  }

  async findOne (id: string): Promise<Order | null> {

    return this.ordersRepository.findOne ({ where: { id } });

  }
  
  async findOne1 (id: string): Promise<Order> {

    const order = await this.ordersRepository.findOne ({ where: { id } });

    if (!order) {

      throw new NotFoundException ('Orden no encontrada');

    }

    return order;

  }

  async saveOrder2 (id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {

    const order = await this.findOne1 (id);
    Object.assign (order, updateOrderDto);
    return await this.ordersRepository.save (order);
  
  }

}





