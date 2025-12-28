import { AuthTokensDTO } from '@/application/dtos/auth-tokens.dto';
import { AuthInstructorUseCase } from '@/application/usecases/authenticate/auth-instructor/auth-instructor.usecase';
import { AuthStudentUseCase } from '@/application/usecases/authenticate/auth-student/auth-student.usecase';
import { FindProfileUseCase } from '@/application/usecases/authenticate/find-profile/find-profile.usecase';
import { Controller, Get, Post } from '@/infra/decorators/controller.decorator';
import { Use } from '@/infra/decorators/middleware.decorator';
import { CookieService } from '@/infra/persistence/out/cookies/cookies.service';
import type { Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { authSchema } from '../schemas/auth/auth.schema';
import { CookiesKeys } from '../utils/cookies-keys';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authInstructor: AuthInstructorUseCase,
    private readonly studentUseCase: AuthStudentUseCase,
    private readonly cookiesService: CookieService,
    private readonly findProfileUseCase: FindProfileUseCase,
  ) {}

  @Post('/instructor')
  public async authenticateInstructor(req: Request, res: Response) {
    const data = authSchema.parse(req.body);

    const tokens: AuthTokensDTO = await this.authInstructor.execute(data.email, data.password);

    this.setAuthCookies(res, tokens);

    res.json(tokens);
  }

  @Post('/student')
  public async authenticateStudent(req: Request, res: Response) {
    const data = authSchema.parse(req.body);

    const tokens: AuthTokensDTO = await this.studentUseCase.execute(data.email, data.password);

    this.setAuthCookies(res, tokens);

    res.json(tokens);
  }

  @Post('/logout')
  public async logout(_: Request, res: Response) {
    this.cookiesService.delete(res, CookiesKeys.ACCESS_TOKEN);
    this.cookiesService.delete(res, CookiesKeys.REFRESH_TOKEN);
    return res.json({ message: 'Logout realizado' });
  }

  @Get('/instructor/profile')
  @Use(AuthMiddleware)
  public async profile(req: Request, res: Response) {
    const profile = await this.findProfileUseCase.execute(req.user?.id!);
    res.json(profile);
  }

  private setAuthCookies(res: Response, tokens: AuthTokensDTO) {
    const { accessToken, refreshToken } = tokens;

    this.cookiesService.set(res, CookiesKeys.ACCESS_TOKEN, accessToken, this.minutes(15));

    this.cookiesService.set(res, CookiesKeys.REFRESH_TOKEN, refreshToken, this.days(30));
  }

  private minutes(minutes: number): number {
    return minutes * 60 * 1000;
  }

  private days(days: number): number {
    return days * 24 * 60 * 60 * 1000;
  }
}
