import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/user.entity';
import { ObjectType,Field,Int, } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Appointment {
  @Field(()=>Int)
  @PrimaryGeneratedColumn()
  id: number;


  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  date: string;

  @Field()
  @Column()
  time: string;

  @Field()
  @Column({default: false})
  completed: boolean;

  @ManyToOne( ()=>User )
  user: User;

  @Field()
  @Column({ default: false })
  reminderBeforeSent: boolean;

  @Field()
  @Column({ default: false })
  reminderAtSent: boolean;

  @Field()
  @Column({ default: false })
  notificationShown: boolean;

  @Field({ nullable: true })
  @Column({
    nullable: true,
  })
  notificationType: string;

}