import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { AppointmentsResolver } from './appointments.resolver';
import { ReminderService } from './reminder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])],
  providers: [AppointmentsService, AppointmentsResolver, ReminderService]
})
export class AppointmentsModule {}
