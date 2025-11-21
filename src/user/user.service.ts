import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account.dto';
import { UserProfileOutput } from './dto/user-profile.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { logger } from 'src/logger/winston';
import { UpdatePasswordOutput } from './dto/update-password.dto';
import { User } from 'src/user/entity/user.entity';
import { PostUseYn } from 'src/post/entity/post.entity';

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
        return { ok: false, error: '이미 존재하는 계정입니다.' };
      }
      await this.user.save(this.user.create({ email, password }));
      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, error: '계정을 생성 할 수 없습니다.' };
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

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return { ok: false, error: '비밀번호가 틀립니다.' };
      }
      const token = this.jwtService.sign(user.id);
      return { ok: true, error: '로그인 성공했습니다', token };
    } catch (e) {
      console.log(e);
      logger.error('로그인 불가', e);
      return {
        ok: false,
        error: '로그인 할 수 없습니다. 관리자에게 문의해주세요',
      };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const userInfo = await this.user.findOneOrFail({
        where: {
          id,
          posts: {
            postUseYn: PostUseYn.Y,
          },
        },
        relations: ['posts', 'posts.comments'],
        order: {
          posts: {
            createdAt: 'DESC',
          },
        },
      });
      return { ok: true, user: userInfo };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '기능에 이상이 있습니다. 관리자에게 문의해주세요.',
      };
    }
  }

  async updatePassword(
    { id }: User,
    password: string,
  ): Promise<UpdatePasswordOutput> {
    try {
      const getUserInfo = await this.findById(id);
      if (!getUserInfo) {
        return { ok: false, message: '유저가 없습니다.' };
      }

      getUserInfo.user.password = password;

      await this.user.save(getUserInfo.user);

      return { ok: true, message: '비밀번호가 변경 됐습니다.' };
    } catch (e) {
      return { ok: false, message: `비밀번호 변경에 실패했습니다 - ${e}` };
    }
  }
}
