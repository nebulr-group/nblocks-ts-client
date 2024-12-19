import { TaxResponse } from "./tax-response";

export class UpdateTaxRequest
    implements Partial<Pick<TaxResponse, 'countryCode' | 'name' | 'percentage'>>
{
    countryCode?: string;
    name?: string;
    percentage?: number;
}