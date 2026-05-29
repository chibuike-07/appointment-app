import { Query, Resolver, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Appointment } from './appointment.entity';
import { AppointmentsService } from './appointments.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => Appointment)
@UseGuards(GqlAuthGuard)
export class AppointmentsResolver {
  constructor(
    private appointmentsService: AppointmentsService,
  ) { }

  @Mutation(() => Appointment)
  createAppointment(
    @Args('name') name: string,
    @Args('date') date: string,
    @Args('time') time: string,
    @Context() context,
  ) {
    const userId = context.req.user.userId;

    return this.appointmentsService.create({
      name,
      date,
      time,
    }, userId);
  }

  @Mutation(() => Appointment)
  updateAppointment(
    @Args('id', { type: () => Int })
    id: number,

    @Args('completed')
    completed: boolean,
  ) {
    return this.appointmentsService.update(
      id,
      { completed },
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