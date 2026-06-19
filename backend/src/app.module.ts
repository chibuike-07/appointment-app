import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointments/appointment.entity'
import { AppointmentsModule } from './appointments/appointments.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppResolver } from './app.resolver';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import 'dotenv/config'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(
        process.cwd(),
        'src/schema.gql',
      ),

      context: ({ req }) => ({
        req,
      }),
      formatError: (error) => {
        const originalError = error.extensions?.originalError as any;
        if (originalError) {
          return {
            ...error,
            message: Array.isArray(originalError.message)
              ? originalError.message[0]
              : originalError.message || error.message,
          };
        }
        return error;
      },
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Appointment, User],
      synchronize: true,
    }),
    AppointmentsModule,
    AuthModule,
    UsersModule,
  ],
  // controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule { }
