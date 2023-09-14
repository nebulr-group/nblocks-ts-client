/**
 * A price defines a certain amount in a certain currency for a specific region.
 */
export class Price {
  /**
   * Logical key used to synchronize data. Must be unique accross all prices in all plans
   * E.g. `${planKey}-${currency}-${recurrenceInterval}`
   */
  key: string;

  /**
   * The amount for each recurring charge
   */
  amount: number;

  /**
   * Three-letter ISO currency code, in lowercase. Must be a supported currency. https://www.iso.org/iso-4217-currency-codes.html
   */
  currency: string;

  /**
   * An interval for how often the customer will be charged for the subscription / plan.
   */
  recurrenceInterval: 'day' | 'month' | 'week' | 'year';
}
