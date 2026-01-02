import { CreatePaymentLessonPixDTO } from '@/application/dtos/create-payment-pix.dto';
import { PixPaymentResponseDTO } from '@/application/dtos/pix-payment-response.dto';

export abstract class PaymentService {
  abstract generatePaymentPix(data: CreatePaymentLessonPixDTO): Promise<PixPaymentResponseDTO>;
}
