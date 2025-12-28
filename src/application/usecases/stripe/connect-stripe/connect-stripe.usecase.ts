import { GatewayService } from '@/application/ports/out/gateway.service';
import { InstructorProfileRepository } from '@/application/ports/out/instructor-profile.repository';
import { UsersRepository } from '@/application/ports/out/users.repository';
import { Injectable } from '@/infra/decorators/injectable.decorator';
import { Transactional } from '@/infra/decorators/transactional.decorator';
import { BadRequestException } from '@/shared/errors/BadRequestException';
import { NotFoundException } from '@/shared/errors/NotFoundException';
import { ConnectStripeCommand } from './connect-stripe.command';

interface Output {
  onboardingUrl: string;
}

@Injectable()
export class ConnectStripeUseCase {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly instructorRepo: InstructorProfileRepository,
    private readonly gateway: GatewayService,
  ) {}

  @Transactional()
  public async execute({ userId }: ConnectStripeCommand): Promise<Output> {
    // 1. Busca o Usuário para pegar o e-mail
    const user = await this.usersRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    // 2. Busca o Perfil do Instrutor
    const profile = await this.instructorRepo.findByUserId(userId);
    if (!profile) {
      throw new BadRequestException('Este usuário não possui um perfil de instrutor.');
    }

    if (!profile.data.stripeAccountId) {
      const newStripeAccountId = await this.gateway.createInstructorAccount(
        user.data.email.getValue(),
      );

      profile.updateStripeAccountId(newStripeAccountId);

      await this.instructorRepo.save(profile);
    }

    const appUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    const returnUrl = `${appUrl}/dashboard/financeiro/sucesso`;
    const refreshUrl = `${appUrl}/dashboard/financeiro/conectar`;

    const onboardingUrl = await this.gateway.generateOnboardingLink(
      profile.data.stripeAccountId!,
      returnUrl,
      refreshUrl,
    );

    return { onboardingUrl };
  }
}
