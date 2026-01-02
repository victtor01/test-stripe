import { AuthTokensDTO } from '@/application/dtos/auth-tokens.dto';
import { TokensPayloadDTO } from '@/application/dtos/generate-tokens.dto';
import { HashService } from '@/application/ports/in/hash.service';
import { TokenService } from '@/application/ports/in/token.service';
import { UsersRepository } from '@/application/ports/out/users.repository';
import { User } from '@/domain/entities/User';
import { UserRole } from '@/domain/enums/UserRole';
import { Injectable } from '@/infra/decorators/injectable.decorator';
import { BadRequestException } from '@/shared/errors/BadRequestException';
import { NotFoundException } from '@/shared/errors/NotFoundException';

@Injectable()
export class AuthStudentUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashService: HashService,
    private readonly tokensService: TokenService,
  ) {}

  async execute(email: string, password: string): Promise<AuthTokensDTO> {
    const user: User | null = await this.usersRepository.findByEmail(email);

    if (user === null) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    const { data } = user;

    const { password: hash, roles } = data;
    if (!user || !roles.includes(UserRole.STUDENT)) {
      throw new BadRequestException('Usuário não existe ou não é um estudante!');
    }

    const isPasswordValid = await this.hashService.compare(password, hash);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    const payload = {
      userId: user.id.toString(),
      roles: user.data.roles,
    } satisfies TokensPayloadDTO;

    const accessToken = await this.tokensService.generateAccessToken(payload);

    const refreshToken = await this.tokensService.generateRefreshToken(user.id.toString());

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
