import { CoreEntity } from 'src/common/entity/core.entity';
import * as bcrypt from 'bcrypt';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { InternalServerErrorException } from '@nestjs/common';

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column({ unique: true, nullable: false })
  @Field(() => String)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(aPassword, this.password);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
