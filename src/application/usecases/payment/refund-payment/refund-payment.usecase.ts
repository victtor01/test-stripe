import { PaymentService } from '@/application/ports/in/payment.service';
import { InstructorProfileRepository } from '@/application/ports/out/instructor-profile.repository';
import { LessonRepository } from '@/application/ports/out/lesson.repository';
import { Injectable } from '@/infra/decorators/injectable.decorator';
import { BadRequestException } from '@/shared/errors/BadRequestException';
import { NotFoundException } from '@/shared/errors/NotFoundException';

interface RequestPayoutCommand {
  instructorUserId: string;
}

interface PayoutResult {
  processedCount: number;
  totalAmountTransferred: number;
  remainingBalance: number;
  errors: string[];
}

@Injectable()
export class RefundPaymentUseCase {
  constructor(
    private readonly lessonRepository: LessonRepository,
    private readonly instructorRepo: InstructorProfileRepository,
    private readonly paymentService: PaymentService,
  ) {}

  async execute(command: RequestPayoutCommand): Promise<PayoutResult> {
    const instructorProfile = await this.instructorRepo.findByUserId(command.instructorUserId);

    if (!instructorProfile?.id) {
      throw new NotFoundException('Perfil de instrutor não encontrado.');
    }

    if (!instructorProfile.data.stripeAccountId) {
      throw new BadRequestException(
        'O instrutor não possui uma conta Stripe conectada para receber.',
      );
    }

    if (instructorProfile.getBalance() <= 0) {
      throw new BadRequestException('Saldo insuficiente para realizar saque.');
    }

    console.log(instructorProfile.id);
    // 2. BUSCAR AULAS PENDENTES
    const pendingLessons = await this.lessonRepository.findPendingPayoutsByInstructorId(
      instructorProfile.data.userId,
    );

    if (pendingLessons.length === 0) {
      throw new BadRequestException(
        'Erro de consistência: Saldo positivo, mas nenhuma aula pendente de repasse encontrada.',
      );
    }

    const result: PayoutResult = {
      processedCount: 0,
      totalAmountTransferred: 0,
      remainingBalance: instructorProfile.getBalance(),
      errors: [],
    };

    // 3. O CICLO DE TRANSFERÊNCIA (LOOP)
    for (const lesson of pendingLessons) {
      try {
        const { price } = lesson.data;

        // Regra de Negócio: Recalcular a parte do instrutor
        // O ideal é que isso estivesse salvo na Lesson como 'netAmount', mas calculamos aqui por segurança
        const platformFeePercentage = 0.2;
        const amountToTransfer = Math.floor(price * (1 - platformFeePercentage));

        // SEGURANÇA DE SALDO:
        // Verifica se o instrutor ainda tem saldo virtual para cobrir essa aula específica.
        // Isso protege contra saldo ficar negativo se houver divergência de dados.
        if (instructorProfile.data.balance < amountToTransfer) {
          console.warn(
            `Saldo insuficiente para processar a aula ${
              lesson.id
            }. Saldo: ${instructorProfile.getBalance()}, Necessário: ${amountToTransfer}`,
          );
          result.errors.push(`Aula ${lesson.id}: Saldo virtual insuficiente.`);
          continue; // Pula essa aula, tenta a próxima menor ou encerra
        }

        if (!lesson.data.stripePaymentIntentId!) {
          throw new Error(
            `Aula ${lesson.id} não possui ID de pagamento original (source_transaction).`,
          );
        }

        // A. EXECUTA A TRANSFERÊNCIA NO STRIPE (Dinheiro Real)
        const transfer = await this.paymentService.releaseFundsToInstructor({
          lessonId: lesson.id.toString(),
          instructorStripeId: instructorProfile.data.stripeAccountId,
          amountInCents: amountToTransfer,
          originalPaymentId: lesson.data.stripePaymentIntentId!,
        });

        instructorProfile.withdrawBalance(amountToTransfer);

        // C. ATUALIZA A AULA
        lesson.markAsTransferred(transfer.id);

        // D. PERSISTÊNCIA ATÔMICA (Desta iteração)
        // Salvamos logo para garantir que, se o servidor cair no próximo loop, esse aqui já conta como pago
        await Promise.all([
          this.lessonRepository.update(lesson),
          this.instructorRepo.update(instructorProfile),
        ]);

        // Atualiza relatório
        result.processedCount++;
        result.totalAmountTransferred += amountToTransfer;
        result.remainingBalance = instructorProfile.getBalance();
      } catch (error: any) {
        console.error(`Falha ao transferir aula ${lesson.id}:`, error);

        // Captura erros específicos do Stripe para dar feedback melhor
        const errorMessage = error.message || 'Erro desconhecido no processamento';
        result.errors.push(`Aula ${lesson.id}: ${errorMessage}`);

        // IMPORTANTE: O loop continua para tentar pagar as outras aulas que não derem erro
      }
    }

    return result;
  }
}
