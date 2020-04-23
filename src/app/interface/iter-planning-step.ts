import {Run} from './run';

export interface IterPlanningStep {
  _id: string;
  name: string;
  type: string;
  run: Run;
  previousStep: string;
}
