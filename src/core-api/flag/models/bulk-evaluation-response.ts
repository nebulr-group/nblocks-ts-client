import { EvaluationResponse } from './evaluation-response';

export interface BulkEvaluationResponse {
  flags: { flag: string; evaluation: EvaluationResponse }[];
}
