import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { OrdersModule } from './modules/orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './Config/typeorm';
import { EvidencesModule } from './modules/evidences/evidences.module';

import { AuthModule } from './modules/Authentication/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { config as envConfig } from 'dotenv';

// Usando dotenv para tomar el valor de la variable de entorno JWT_SECRET.
envConfig({
  path: '.env',
});

import { NotificationsModule } from './modules/notifications/notifications.module';
import { MailModule } from './modules/mail/mail.module';
import { DatabaseModule } from './modules/database/seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm'),
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: 28400 }, // Expira en 24 horas, cheqeuar si el numero de segundos es correcto.
    }),
    UsersModule,
    OrdersModule,
    EvidencesModule,
    AuthModule,
    NotificationsModule,
    MailModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
