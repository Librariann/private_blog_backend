import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account.dto';
import { UserProfileOutput } from './dto/user-profile.dto';

export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}

  //TODO: logger 도입.. winston 사용 할 것
  async createAccount({
    email,
    password,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const checkExistsEmail = await this.user.findOne({ where: { email } });
      if (checkExistsEmail) {
        return {
          ok: false,
          error: '이미 존재하는 계정입니다.',
        };
      }
      await this.user.save(this.user.create({ email, password }));
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '계정을 생성 할 수 없습니다.',
      };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '기능에 이상이 있습니다. 관리자에게 문의해주세요.',
      };
    }
    const userInfo = await this.user.findOneByOrFail({
      id,
    });

    return {
      ok: true,
      user: userInfo,
    };
  }
}
