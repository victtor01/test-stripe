import { InstructorProfileRepository } from '@/application/ports/out/instructor-profile.repository';
import { Injectable } from '@/infra/decorators/injectable.decorator';
import Stripe from 'stripe';

@Injectable()
export class HandleStripeWebhookUseCase {
  constructor(private readonly instructorRepo: InstructorProfileRepository) {}

  public async execute(event: Stripe.Event): Promise<void> {
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

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Pagamento recebido para a aula: ${paymentIntent.metadata.lessonId}`);
    }
  }
}
