export enum LessonStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT', // Criada, mas aluno não pagou
  SCHEDULED = 'SCHEDULED',             // Paga (Dinheiro no Stripe/Hold)
  COMPLETED = 'COMPLETED',             // Aula aconteceu (Dinheiro ainda no Stripe)
  FUNDS_RELEASED = 'FUNDS_RELEASED',   // Dinheiro transferido ao Instrutor
  CANCELED = 'CANCELED',               // Cancelada (Reembolso)
  DISPUTED = 'DISPUTED'                // Aluno reclamou (Stripe segura o dinheiro)
}