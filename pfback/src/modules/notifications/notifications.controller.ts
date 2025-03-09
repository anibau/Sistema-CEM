import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from "@nestjs/common";
import { NotificationService } from "./notifications.service";
import { CreateNotificationDto } from "src/dto/notification/notification.dto";

@Controller('notifications')
export class NotificationsController{
    constructor(private readonly notificationService: NotificationService){}

   @Get()
    async findAll(){
        try{
            return this.notificationService.findAll()
        }catch(error){
            throw new BadRequestException('Error creating notification '+ error)
        }
    }

    @Get(':id')
    async findOne(@Param('id' , ParseUUIDPipe) id:string){
        try{
            return this.notificationService.findOne(id)
        }catch(error){
            throw new BadRequestException('Error creating notification '+ error)
        }
    }

    @Get('/order/:orderId')
    async findByOrder(@Param('orderId' , ParseUUIDPipe) orderId:string){
        try{
            return this.notificationService.findByOrder(orderId)
        }catch(error){
            throw new BadRequestException('Error creating notification '+ error)
        }
    }
    @Get('/user/:dni')
    async findByClientDni(@Param('dni') dni:string){
        try{
            return this.notificationService.findByClientDni(dni)
        }catch(error){
            throw new BadRequestException('Error creating notification '+ error)
        }
    }

    @Post()
    async create(@Body()  notificationDto: CreateNotificationDto){
        try{
            return this.notificationService.create(notificationDto)
        }catch(error){
            throw new BadRequestException('Error creating notification '+ error)
        }
    }

    @Put('/:id/resend')
    async resendNotification(@Param('id', ParseUUIDPipe) id: string) {
      return this.notificationService.resendNotification(id);
    }
  
    @Delete('/:id')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
      return this.notificationService.delete(id);
    }
  
    @Delete('/order/:orderId')
    async deleteByOrder(@Param('orderId', ParseUUIDPipe) orderId: string) {
      return this.notificationService.deleteByOrder(orderId);
    }
}