import { Role } from 'src/enum/Role.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v7 as uuid } from 'uuid';
import { Order } from '../orders/Order.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
id: string;

  @Column({
    nullable: false,
    length: 50,
    unique:true
  })
  name: string;

  @Column({
    length: 50,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: true,
  })
  password: string;

  @Column({
    nullable: false,
  })
  phone: string;

 
  // Define el campo DNI como un string
  @Column({ type: 'varchar', length: 8 }) 
  dni: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT,
  })
  role: string;

  @Column({
    type: 'date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  //@OneToMany(() => Order, (order) => order.users)
  //orders: Order[];
  @OneToMany(() => Order, (order) => order.Admin)
adminOrders: Order[];

@OneToMany(() => Order, (order) => order.assignedTechn)
technicianOrders: Order[];
}
