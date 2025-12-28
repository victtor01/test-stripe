export const envConfig = {
  stripeAccessKey: process.env.STRIPE_ACCESS_KEY!,

  stripe: {
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  }
  
};
