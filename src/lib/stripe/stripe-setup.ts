import { envConfig } from '@/config/env.config';
import Stripe from 'stripe';

const STRIPE_KEY = envConfig.stripeAccessKey;

if (!STRIPE_KEY) {
  console.log('[ERROR]: STRIPE_ACCESS_KEY is not defined in environment variables.');
}

export const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});
