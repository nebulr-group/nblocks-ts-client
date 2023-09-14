export class Tax {
  /**
   * two-letter ISO country code. https://www.nationsonline.org/oneworld/country_code_list.htm
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
}
