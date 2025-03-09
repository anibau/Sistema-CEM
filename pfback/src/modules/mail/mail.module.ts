import { Module } from "@nestjs/common";
import {MailerModule} from "@nestjs-modules/mailer"
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailService } from "./mail.service";

@Module({
    imports:[ 
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
              transport: {
                host: configService.get<string>('EMAIL_HOST'),
                port: configService.get<number>('EMAIL_PORT'),
                secure: configService.get<boolean>('EMAIL_SECURE'),
                auth: {
                  user: configService.get<string>('EMAIL_USER'),
                  pass: configService.get<string>('EMAIL_PASS'),
                },
              },
              defaults: {
                from: '"Soporte Técnico Sistema Gestion CEM " <sistemagestion.cem@gmail.com>',
              },
            }),
        }),
    ],
    controllers:[],
    providers:[MailService],
    exports:[MailService]
})
export class MailModule{}