import { GatewayService } from '@/application/ports/out/gateway.service';
import { Injectable } from '@/infra/decorators/injectable.decorator';
import Stripe from 'stripe';

@Injectable()
export class StripeService implements GatewayService {
  private stripe: Stripe;

  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }

  async createStudentCustomer(name: string, email: string): Promise<string> {
    const customer = await this.stripe.customers.create({
      email,
      name,
      description: `Aluno: ${name}`,
    });

    return customer.id;
  }

  async createInstructorAccount(email: string): Promise<string> {
    const account = await this.stripe.accounts.create({
      type: 'express', // Melhor opção para marketplaces
      country: 'BR',
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    return account.id; // Retorna ex: 'acct_1Qa...'
  }

  async generateOnboardingLink(
    accountId: string,
    returnUrl: string,
    refreshUrl: string,
  ): Promise<string> {
    const link = await this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl, // Se der erro ou expirar, volta pra cá
      return_url: returnUrl, // Sucesso, volta pra cá
      type: 'account_onboarding',
    });

    return link.url;
  }
}
