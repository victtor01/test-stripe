import { CreatePaymentLessonDTO } from '@/application/dtos/create-payment-pix.dto';
import { LinkPaymentResponse } from '@/application/dtos/link-payment-response.dto';
import { PixPaymentResponseDTO } from '@/application/dtos/pix-payment-response.dto';
import { ReleaseFundsDTO } from '@/application/dtos/release-funds.dto';

export abstract class PaymentService {
  abstract generatePaymentLink(data: CreatePaymentLessonDTO): Promise<LinkPaymentResponse>;
  abstract generatePaymentPix(data: CreatePaymentLessonDTO): Promise<PixPaymentResponseDTO>;
  abstract releaseFundsToInstructor(data: ReleaseFundsDTO): Promise<any>;
}
