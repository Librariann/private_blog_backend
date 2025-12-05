import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { UserResolver } from './user.resolver';
import { Hashtag } from 'src/hashtag/entity/hashtag.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Hashtag])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
