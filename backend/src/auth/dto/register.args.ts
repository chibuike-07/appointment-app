import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

@ArgsType()
export class RegisterArgs {
  @Field()
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  firstName: string;

  @Field()
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  lastName: string;

  @Field()
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @Field()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
