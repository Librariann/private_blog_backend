import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account.dto';
import { UserProfileOutput } from './dto/user-profile.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { logger } from 'src/logger/winston';

export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

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

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.user.findOne({
        where: { email },
        select: ['id', 'password'],
      });
      if (!user) {
        logger.info('유저 없음');
        return { ok: false, error: '유저를 찾지못했습니다' };
      }

      //jwt의 중요점은 정보의 은닉이 아닌 정보가 변경됐는지를 파악하기 위해 사용하는것
      //만약 정보가 변경됐다면 백엔드에서 발급한 토큰 값이랑 다르기때문에 토큰의 변경 진위여부를 파악할수있다
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        logger.info('비밀번호 틀림');
        return { ok: false, error: '비밀번호가 틀립니다.' };
      }
      //sign에 user.id만 넘겨주는것은 이 프로젝트에서만 사용 할것이기때문에
      //만약 다른 프로젝트에서 더 크게 사용한다면 object형태로 넘겨주면된다
      const token = this.jwtService.sign(user.id);
      logger.info('로그인 성공');
      return { ok: true, error: '로그인 성공했습니다', token };
    } catch (e) {
      console.log(e);
      logger.info('로그인 불가', e);
      return {
        ok: false,
        error: '로그인 할 수 없습니다. 관리자에게 문의해주세요',
      };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const userInfo = await this.user.findOneOrFail({
        where: { id },
        relations: ['posts', 'comments'],
      });
      console.log(userInfo);
      return {
        ok: true,
        user: userInfo,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '기능에 이상이 있습니다. 관리자에게 문의해주세요.',
      };
    }
  }
}
