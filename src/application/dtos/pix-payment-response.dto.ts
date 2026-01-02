export interface PixPaymentResponseDTO {
  clientSecret: string | null;
  pixCode?: string; // Dados do QR Code se disponíveis na criação (as vezes vem no webhook)
  id?: string;
}
