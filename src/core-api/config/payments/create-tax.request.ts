import { TaxResponse } from "./tax-response";

export class CreateTaxRequest
    implements Pick<TaxResponse, 'countryCode' | 'name' | 'percentage'>
{
    countryCode: string;
    name: string;
    percentage: number;
}