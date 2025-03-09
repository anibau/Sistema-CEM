import { BadRequestException, Injectable } from "@nestjs/common";
import { NotificationsRepository } from "./notifications.repository";
import { CreateNotificationDto } from "src/dto/notification/notification.dto";
import { Cron } from "@nestjs/schedule";
import { MailService } from "../mail/mail.service";

@Injectable()
export class NotificationService{
    constructor(private readonly notificationRepository: NotificationsRepository,
            private readonly mailService: MailService,
    ){}

      //* 🔹 Recordatorio para aceptar el presupuesto (cada 3 min, hasta 3 intentos)
  @Cron("*/3 * * * *") // ✅ Cada 3 minutos
  async remindBudgetAcceptance() {
    console.log('Ejecutando recordatorio de aceptación de presupuesto...');


        const revisionOrders = await this.notificationRepository.getRevisionOrders();
        try{

        for (const order of revisionOrders) {
            const notificationsCount = await this.notificationRepository.countNotifications(order.id);
            console.log(`Orden: ${order.id} - Notificaciones enviadas: ${notificationsCount}`);
            if (notificationsCount < 3) {
                await this.mailService.sendNotificationEmail(
                    order.clientEmail,
                    `Estimado cliente, aún no hemos recibido su confirmación de presupuesto sobre la reparación de su equipo. Por favor, responda para proceder.`,
                ) ;

                await this.notificationRepository.createBudgetReminder(order);
                console.log(`📧 Notificación enviada a ${order.clientEmail}`);
            } else{
                console.log(`notificaciones completas ${order.clientEmail}`)
            }
        }
 } catch{
     throw new BadRequestException('error al enviar email')
   }
}



    async create(createNotificationDto: CreateNotificationDto){
        return this.notificationRepository.create(createNotificationDto)
    }

    async findAll(){
        return this.notificationRepository.findAll()
    }

    async findByOrder(orderId: string){
        return this.notificationRepository.findByOrder(orderId)
    }

    async findOne(id: string){
        return this.notificationRepository.findOne(id)
    }

    async findByClientDni(dni){
        return this.notificationRepository.findByClientDni(dni)
    }

    async resendNotification(id: string){
        return this.notificationRepository.resendNotification(id)
    }

    async delete(id: string){
        return this.notificationRepository.delete(id)
    }

    async deleteByOrder(id: string){
        return this.notificationRepository.deleteByOrder(id)
    }
}