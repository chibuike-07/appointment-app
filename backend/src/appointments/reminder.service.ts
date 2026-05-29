import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';

@Injectable()
export class ReminderService {
    constructor(
        @InjectRepository(Appointment)
        private appointmentRepo: Repository<Appointment>,
    ) { }

  @Cron('* * * * *')
  async handleReminderCheck() {
    const appointments =
    await this.appointmentRepo.find({
      relations: ['user'],
    });
    const now = new Date();

    for (const appointment of appointments) {
        const [year, month, day] =
        appointment.date
        .split('-')
        .map(Number);

        const [hours, minutes] =
        appointment.time
        .split(':')
        .map(Number);

        const appointmentDateTime =
        new Date(
            year,
            month - 1,
            day,
            hours,
            minutes,
            );

        const reminderBeforeTime =
        new Date(
            appointmentDateTime.getTime() -
            15 * 60 * 1000
        );
        if (
            now >= reminderBeforeTime &&
            !appointment.reminderBeforeSent
        ) {
        console.log(
            `Reminder: ${appointment.name} starts in 15 minutes`,
        );
        appointment.reminderBeforeSent = true;
        appointment.notificationShown = false;
        appointment.notificationType = 'before';
        await this.appointmentRepo.save(appointment); 
        };

        if (
            now >= appointmentDateTime &&
            !appointment.reminderAtSent
        ) {

            console.log(
                `Reminder:
                ${appointment.name}
                starts NOW`
            );

            appointment.reminderAtSent = true;
            appointment.notificationShown = false;
            appointment.notificationType = 'at';

            await this.appointmentRepo.save(appointment);
          }
          console.log(
            'NOW:',
            now.toLocaleString(
              'en-NG',
              { timeZone: 'Africa/Lagos' }
            )
          );

          console.log(
            'APPOINTMENT:',
            appointmentDateTime.toLocaleString(
              'en-NG',
              { timeZone: 'Africa/Lagos' }
            )
            );
        }

    console.log(
    'Appointments found:',
    appointments.length,
    );
};
  }