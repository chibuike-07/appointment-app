import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class CreateAppointmentArgs {
  @Field()
  @IsNotEmpty({ message: 'Appointment name/title is required' })
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty({ message: 'Date is required' })
  @IsString()
  date: string;

  @Field()
  @IsNotEmpty({ message: 'Time is required' })
  @IsString()
  time: string;
}
