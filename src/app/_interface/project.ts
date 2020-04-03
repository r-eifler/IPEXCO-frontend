import {PDDLFile} from './pddlfile';

export interface Project {
  _id: string;
  name: string;
  domain_file: PDDLFile;
  problem_file: PDDLFile;
  description: string;
  properties: string[];
  hard_properties: string[];
  soft_properties: string[];
}
