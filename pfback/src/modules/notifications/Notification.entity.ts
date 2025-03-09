import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v7 as uuid } from 'uuid';
import { Order } from '../orders/Order.entity';

// Definimos el enum para los tipos de notificación
export enum NotificationType {
  BUDGET_REMINDER = 'BUDGET_REMINDER',
  STATUS_UPDATE = 'STATUS_UPDATE',
}

@Entity({
  name: 'notifications',
})
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({
    type: 'enum',
    enum: NotificationType,
    nullable: false,
  })
  type: NotificationType; // Nuevo campo para indicar el tipo de notificación


  @Column({
    type: 'text',
    nullable: false,
  })
  message: string;

  @Column({
    type: 'date',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @ManyToOne(() => Order, (order) => order.notifications)
  order: Order;
}
