import { Price } from './price';

/**
 * A plan describes a certain subscription type and allows you to sell your app in different ways. Different plans usually enables different feature set of your app.
 * A `Tenant` (customer) will be able to change between different plans. Each plan must declare a price for each region you're suppose to sell to
 */
export class Plan {
  /**
   * Display name of the plan
   */
  name: string;

  /**
   * Description of the plan
   */
  description?: string;

  /**
   * Logical key used to synchronize data. Must be unique
   */
  key: string;

  /**
   * The product starts with a trial and then converts into paid.
   * To disable trials, put 0 | undefined
   */
  trialDays?: number;
  
  /**
   * All prices for each region
   */
  prices: Price[];
}
