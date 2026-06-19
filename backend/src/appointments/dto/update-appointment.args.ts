import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsBoolean, IsNotEmpty } from 'class-validator';

@ArgsType()
export class UpdateAppointmentArgs {
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Date cannot be empty' })
  date?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Time cannot be empty' })
  time?: string;
}
