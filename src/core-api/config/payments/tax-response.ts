export class TaxResponse {
  id: string;
  /**
   * two-letter ISO country code. https://www.nationsonline.org/oneworld/country_code_list.htm
   * Stripe "We currently support the following countries: US, GB, AU, and all countries in the EU." https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-line_items-dynamic_tax_rates
   */
  countryCode: string;

  /**
   * Name of the tax, visible on checkout form
   */
  name: string;

  /**
   * Percentage with which the sub total is increased with. `0` - `100`
   */
  percentage: number;

  createdAt: Date;
}
