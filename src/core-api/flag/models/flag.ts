import { Segment } from "./segment";

export class Flag {
  id: string;
  key: string;
  description: string;
  defaultValue: boolean;
  segments: Segment[];
  targetValue?: boolean;
  enabled: boolean;
}

export class FlagInput {
  id?: string;

  key?: string;

  description?: string;

  defaultValue?: boolean;

  segments?: string[];

  targetValue?: boolean;

  enabled?: boolean;
}