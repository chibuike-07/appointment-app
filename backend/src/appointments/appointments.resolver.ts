import { Query, Resolver, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Appointment } from './appointment.entity';
import { AppointmentsService } from './appointments.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CreateAppointmentArgs } from './dto/create-appointment.args';
import { UpdateAppointmentArgs } from './dto/update-appointment.args';

@Resolver(() => Appointment)
@UseGuards(GqlAuthGuard)
export class AppointmentsResolver {
  constructor(
    private appointmentsService: AppointmentsService,
  ) { }

  @Mutation(() => Appointment)
  createAppointment(
    @Args() args: CreateAppointmentArgs,
    @Context() context,
  ) {
    const userId = context.req.user.userId;

    return this.appointmentsService.create({
      name: args.name,
      date: args.date,
      time: args.time,
    }, userId);
  }

  @Mutation(() => Appointment)
  updateAppointment(
    @Args('id', { type: () => Int })
    id: number,
    @Args() args: UpdateAppointmentArgs,
  ) {
    const updateData: Record<string, unknown> = {};
    if (typeof args.completed === 'boolean') updateData.completed = args.completed;
    if (typeof args.name === 'string') updateData.name = args.name;
    if (typeof args.date === 'string') updateData.date = args.date;
    if (typeof args.time === 'string') updateData.time = args.time;
    return this.appointmentsService.update(
      id,
      updateData,
    );
  }

  @Mutation(() => Boolean)
  async deleteAppointment(
    @Args('id', { type: () => Int })
    id: number,
  ) {
    await this.appointmentsService.remove(
      id,
    );

  return true;
    }

  @Query(() => [Appointment])
  appointments(@Context() context) {
    const userId = context.req.user.userId;
    return this.appointmentsService.findAll(userId);
  }

  @Query(() => [Appointment])
  async dueNotifications(@Context() context) {
    const userId = context.req.user.userId;
    return this.appointmentsService.getDueNotifications(userId);
  }

  @Mutation(() => Boolean)
  async markNotificationShown(@Args('id') id: number,) {
    await this.appointmentsService.markNotificationShown(id);
    return true;
  }
}