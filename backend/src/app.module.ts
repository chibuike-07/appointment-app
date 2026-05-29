import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Appointment} from './appointments/appointment.entity'
import { AppointmentsModule } from './appointments/appointments.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppResolver } from './app.resolver';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
  ScheduleModule.forRoot(),
  GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: join(
    process.cwd(),
    'src/schema.gql',
  ),

  context: ({ req }) => ({
    req,
    }),
  }),

  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'appointments_db',
    entities: [Appointment, User],
    synchronize: true,
  }),
  AppointmentsModule,
  AuthModule,
  UsersModule,
],
  controllers: [AppController],
  providers: [AppService,AppResolver],
})
export class AppModule {}
