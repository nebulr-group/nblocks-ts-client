import { Plan } from './plan';
import { Tax } from './tax';

/**
 * The business model defines what plans are available to subscribe to and what taxes applies.
 * This model is used to configure the checkout for each region
 */
export class BusinessModel {
  /**
   * A list of plans, should have unique names
   */
  plans: Plan[];

  /**
   * A list of taxes that should be applied for each region
   */
  taxes: Tax[];
}
