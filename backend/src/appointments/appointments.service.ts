import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  findAll(userId: number) {
    return this.appointmentRepo.find({
      where: { user: { id: userId } },
    });
  };
  async create(data, userId: number) {
  if (!data.name.trim()) {
  throw new Error ('Appointment name cannot be empty');
  }
  const appointmentDateTime =
  new Date(
    `${data.date}T${data.time}`
  );
  const now = new Date();


  if (
    appointmentDateTime < now
  ) {
    throw new Error(
      'Cannot create appointment in the past',
    );
    }

  const existingAppointment =
  await this.appointmentRepo.findOne({
    where: {
      user: { id: userId },
      date: data.date,
      time: data.time,
    },
  });

  if (existingAppointment) {
    throw new Error(
      'Appointment already exists at this time',
    );
  }
  //reminder before time 15 minutes before...
  const reminderBeforeTime =
  new Date(
    appointmentDateTime.getTime() -
      15 * 60 * 1000
  );
  console.log('reminder before:', reminderBeforeTime)
  // console.log('appointment now:', appointmentDateTime)
  // console.log('local time:', now)

  
  const appointment = this.appointmentRepo.create({
    ...data,
    reminderBeforeSent: false,
    reminderAtSent: false,
    user: { id: userId },
  });

  return this.appointmentRepo.save(appointment);
  }

  async remove(id: number) {
    await this.appointmentRepo.delete(id);
  }

  async update(id: number, update: Partial<any>) {
  await this.appointmentRepo.update(id, update); 
  return this.appointmentRepo.findOneBy({ id });
  }

  async getDueNotifications(userId: number) {
    return this.appointmentRepo.find({
      where: [
        { notificationShown: false, reminderBeforeSent: true, user: { id: userId } },
        { notificationShown: false, reminderAtSent: true, user: { id: userId } },
      ],
    });
  }

  async markNotificationShown(id: number) {
    const appointment = await this.appointmentRepo.findOne({where: { id }});
    if (!appointment) return;
    appointment.notificationShown = true;

    await this.appointmentRepo.save(appointment);
  }
  
}