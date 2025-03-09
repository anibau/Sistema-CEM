import { Injectable } from "@nestjs/common";
import {MailerService} from "@nestjs-modules/mailer"

@Injectable()
export class MailService{
    constructor (private readonly mailerService: MailerService){}

    //   async sendNotificationEmail(email: string, message: string): Promise<void> {
    //     await this.mailerService.sendMail({
    //       to: email,
    //       subject: 'Notificación de Orden',
    //       text: message, //  Envía el mensaje como texto plano
    //       html: `<p>${message}</p>`, //  Opción para enviar el mensaje como HTML
    //     });
    //   }

    async sendNotificationEmail(email: string, message: string): Promise<void> {
        await this.mailerService.sendMail({
          to: email,
          subject: '📢 Notificación de su Orden - Soporte Técnico',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
              
              <!-- Encabezado con logo -->
              <div style="text-align: center;">
                <img src="https://blog.soyhenry.com/content/images/2022/01/Currcula-Henry.png" alt="Logo de la Empresa" width="500" height="100">
                <h2 style="color: #2C3E50;">Soporte Técnico - Empresa Sistema Gestion CEM</h2>
              </div>
    
              <hr style="border: 0; border-top: 1px solid #ccc;">
    
              <!-- Mensaje principal -->
              <p style="font-size: 16px; color: #333;">
                Estimado cliente, 
              </p>
              <p style="font-size: 16px; color: #7d7f7d;">
                ${message}
              </p>
    
              <p style="font-size: 16px; color: #333;">
                Si tiene alguna pregunta o necesita más información, no dude en contactarnos.
              </p>
    
              <hr style="border: 0; border-top: 1px solid #ccc;">
    
              <!-- Pie de página -->
              <p style="text-align: center; font-size: 14px; color: #555;">
                📍 Dirección: Av. Tecnológica 123, Ciudad Lima-Perú<br>
                📞 Teléfono: +123 456 7890 | ✉️ Email: sistemagestion.cem@gmail.com
              </p>
    
              <p style="text-align: center; font-size: 14px; color: #777;">
                Gracias por confiar en nosotros. ¡Estamos aquí para ayudarlo!  
              </p>
    
            </div>
          `,
        });
    }
}