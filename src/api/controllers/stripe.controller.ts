import { HandleStripeWebhookUseCase } from '@/application/usecases/stripe/handle-webhook/handle-webhook.usecase';
import { envConfig } from '@/config/env.config';
import { Controller, Post } from '@/infra/decorators/controller.decorator';
import { Request, Response } from 'express';
import { Stripe } from 'stripe';

@Controller('/webhooks')
export class StripeWebhookController {
  constructor(
    private readonly stripe: Stripe,
    private readonly handleWebhookStripe: HandleStripeWebhookUseCase,
  ) {}

  @Post('/stripe')
  public async handle(req: Request, res: Response): Promise<void> {
    const signature = req.headers['stripe-signature'] as string;

    const endpointSecret = envConfig.stripe.webhookSecret;

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(req.body, signature, endpointSecret!);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    await this.handleWebhookStripe.execute(event);

    res.json({ received: true });
  }
}
