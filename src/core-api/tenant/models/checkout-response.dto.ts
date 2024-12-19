export class CheckoutResponsetDto {
    /** A checkout ID to create a `Stripe` checkout form */
    id: string;
  
    /** Use this key to initiate a Stripe client and use the `id` property to start checkoutSession */
    publicKey: string;
  }