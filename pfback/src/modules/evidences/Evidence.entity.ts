import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v7 as uuid } from 'uuid';
import { Order } from '../orders/Order.entity';

@Entity({
  name: 'evidences',
})
export class Evidence {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({
    nullable: false,
  })
  fileUrl: string;

  @Column({
    type: 'date',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Order, (order) => order.evidences)
  order: Order;
}
