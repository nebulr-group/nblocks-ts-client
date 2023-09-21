import { Price } from "./price";

export class PlanResponse {

    id: string;
  
    /**
    * Logical key used to synchronize data. Must be unique and cannot be changed after set
    */
    key: string;
  
    /**
     * Display name of the plan
     */
    name: string;
  
    /**
     * Description of the plan
     */
    description?: string;
  
    /**
     * The product starts with a trial and then converts into paid.
     */
    trial: boolean;
  
    /**
     * The number of days the trial will run.
     */
    trialDays: number;
  
    /**
     * All prices for each region. You can have several prices in the same region but with different recur settings
     */
    prices: Price[];
  
    createdAt: Date;
  }