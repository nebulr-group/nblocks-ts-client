import { Target } from "./target";

export class Segment {
  id: string;
  key: string;
  description: string;
  targets: Target[];
}

export class SegmentInput {
  id?: string;
  key?: string;
  description?: string;
  targets?: Target[];
}