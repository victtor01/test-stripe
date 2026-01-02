import { CreatePaymentLessonDTO } from '@/application/dtos/create-payment-pix.dto';
import { LinkPaymentResponse } from '@/application/dtos/link-payment-response.dto';
import { PixPaymentResponseDTO } from '@/application/dtos/pix-payment-response.dto';
import { ReleaseFundsDTO } from '@/application/dtos/release-funds.dto';
import { PaymentService } from '@/application/ports/in/payment.service';
import { Injectable } from '@/infra/decorators/injectable.decorator';
import Stripe from 'stripe';

@Injectable()
export class StripePaymentService implements PaymentService {
  constructor(private readonly stripe: Stripe) {}

  async releaseFundsToInstructor(data: ReleaseFundsDTO): Promise<Stripe.Transfer> {
    try {
      console.log(`🔍 Buscando Charge ID para o pagamento: ${data.originalPaymentId}`);

      let sourceTransactionId = data.originalPaymentId;

      if (sourceTransactionId.startsWith('pi_')) {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(sourceTransactionId);

        // O campo 'latest_charge' contém o ID da transação do cartão (ch_...)
        if (!paymentIntent.latest_charge) {
          throw new Error(
            `O PaymentIntent ${sourceTransactionId} não possui uma cobrança (Charge) associada. O pagamento foi capturado?`,
          );
        }

        // O latest_charge pode vir como objeto ou string. Garantimos que seja string.
        sourceTransactionId =
          typeof paymentIntent.latest_charge === 'string'
            ? paymentIntent.latest_charge
            : paymentIntent.latest_charge.id;

        console.log(
          `✅ ID Convertido: ${data.originalPaymentId} (PI) -> ${sourceTransactionId} (CH)`,
        );
      }

      console.log(`💸 Transferindo para ${data.instructorStripeId}...`);

      const transfer = await this.stripe.transfers.create({
        amount: data.amountInCents,
        currency: 'brl',
        destination: data.instructorStripeId,
        source_transaction: sourceTransactionId,
        transfer_group: `lesson_${data.lessonId}`,
        metadata: {
          lessonId: data.lessonId,
          type: 'payout_manual',
        },
      });

      return transfer;
    } catch (error: any) {
      console.error('❌ Erro no Stripe Service:', error);
      throw error; // Deixa o UseCase tratar o erro e continuar o loop
    }
  }

  async generatePaymentLink(data: CreatePaymentLessonDTO): Promise<LinkPaymentResponse> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: 'Aula Particular',
                description: 'Aula de Reforço - Plataforma ClickCut',
              },
              unit_amount: data.amountInCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',

        metadata: {
          lessonId: data.lessonId,
        },

        payment_intent_data: {
          transfer_group: `lesson_${data.lessonId}`,
          on_behalf_of: data.instructorId,

          metadata: {
            lessonId: data.lessonId,
          },
        },

        success_url: `http://localhost:3000/sucesso?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3000/cancelado`,
      });

      return {
        url: session.url,
        id: session.id,
      };
    } catch (error) {
      console.error('Erro ao criar Checkout Session:', error);
      throw error;
    }
  }

  async generatePaymentPix(data: CreatePaymentLessonDTO): Promise<PixPaymentResponseDTO> {
    try {
      const intent = await this.stripe.paymentIntents.create({
        amount: data.amountInCents,
        currency: 'brl',
        payment_method_types: ['pix'],
        transfer_group: `lesson_${data.lessonId}`,
        on_behalf_of: data.instructorId,
        metadata: {
          lessonId: data.lessonId,
          studentId: data.studentId,
          product: 'Aula Particular',
        },
      });

      return {
        clientSecret: intent.client_secret,
        pixCode: intent.next_action?.pix_display_qr_code?.data, // Dados do QR Code se disponíveis na criação (as vezes vem no webhook)
        id: intent.id,
      };
    } catch (error) {
      console.error('Erro ao criar Intent:', error);
      throw error;
    }
  }
}
