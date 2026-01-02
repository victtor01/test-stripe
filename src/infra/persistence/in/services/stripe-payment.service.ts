import { CreatePaymentLessonPixDTO } from '@/application/dtos/create-payment-pix.dto';
import { PixPaymentResponseDTO } from '@/application/dtos/pix-payment-response.dto';
import { PaymentService } from '@/application/ports/in/payment.service';
import { Injectable } from '@/infra/decorators/injectable.decorator';
import Stripe from 'stripe';

@Injectable()
export class StripePaymentService implements PaymentService {
  constructor(private readonly stripe: Stripe) {}

  async generatePaymentPix(data: CreatePaymentLessonPixDTO): Promise<PixPaymentResponseDTO> {
    try {
      const intent = await this.stripe.paymentIntents.create({
        amount: data.amountInCents,
        currency: 'brl',
        payment_method_types: ['pix'],

        transfer_group: `lesson_${data.lessonId}`,

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
