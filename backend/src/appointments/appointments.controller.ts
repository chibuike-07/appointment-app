import { Controller, Get, Post, Body, Delete, Param, Patch} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';

@UseGuards(AuthGuard('jwt'))
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  getAll(@Req() req) {
    return this.appointmentsService.findAll(req.user.userId);
  }
  
  @Post()
  create(@Body() body, @Req() req) {
    return this.appointmentsService.create(
    body,
    req.user.userId,
    );
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.appointmentsService.remove(Number(id));
    return { message: 'Deleted successfully' };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.appointmentsService.update(Number(id), body);
}
}