import { InstructorProfileRepository } from '@/application/ports/out/instructor-profile.repository';
import { LessonRepository } from '@/application/ports/out/lesson.repository';
import { Injectable } from '@/infra/decorators/injectable.decorator';
import Stripe from 'stripe';

@Injectable()
export class HandleStripeWebhookUseCase {
  constructor(
    private readonly instructorRepo: InstructorProfileRepository,
    private readonly lessonRepository: LessonRepository,
  ) {}

  public async execute(event: Stripe.Event): Promise<void> {
    console.log(`[ENTROU NO WEBHOOK] Tipo do evento: ${event.type}`);

    if (event.type === 'account.updated') {
      const account = event.data.object as Stripe.Account;
      if (account.details_submitted) {
        console.log(`✅ Instrutor ${account.id} completou o cadastro!`);
        const profile = await this.instructorRepo.findByStripeAccountId(account.id);
        if (profile) {
          profile.completeOnboarding();
          await this.instructorRepo.save(profile);
        }
      }
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const lessonId = session.metadata?.lessonId;

      if (lessonId) {
        await this.handlePaymentSuccess(lessonId, session.payment_intent as string);
      } else {
        console.warn('⚠️ Checkout completado sem lessonId no metadata');
      }
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const lessonId = paymentIntent.metadata?.lessonId;

      if (lessonId) {
        await this.handlePaymentSuccess(lessonId, paymentIntent.id);
      }
    }
  }

  private async handlePaymentSuccess(lessonId: string, paymentId: string) {
    console.log(`💰 Processando pagamento para aula: ${lessonId}`);

    const lesson = await this.lessonRepository.findById(lessonId);

    if (!lesson) {
      console.error(`Aula não encontrada: ${lessonId}`);
      return;
    }

    lesson.markAsPaid(paymentId);

    await this.lessonRepository.update(lesson);

    console.log(`✅ Aula ${lessonId} marcada como PAGA.`);
  }
}
