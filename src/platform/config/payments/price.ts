/**
 * A price defines a certain amount in a certain currency for a specific region.
 */

export type RecurrenceInterval = 'day' | 'month' | 'week' | 'year';
export type Currency = 'EUR' | 'USD' | 'SEK' | string;

export class Price {

  /**
   * The amount for each recurring charge
   */
  amount: number;

  /**
   * Three-letter ISO currency code, in lowercase. Must be a supported currency. https://www.iso.org/iso-4217-currency-codes.html
   */
  currency: Currency;

  /**
   * An interval for how often the customer will be charged for the subscription / plan.
   */
  recurrenceInterval: RecurrenceInterval;
}
