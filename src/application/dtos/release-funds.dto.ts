export interface ReleaseFundsDTO {
  lessonId: string;
  instructorStripeId: string; // O ID 'acct_...'
  amountInCents: number;
  originalPaymentId: string;
}
