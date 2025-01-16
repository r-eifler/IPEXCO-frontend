import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";
import { QuestionType } from "../explanation/explanations";

export type Role = 'sender' | 'receiver';

export type StructuredText = {
  includeComputation?: boolean;
  mainText: string;
  setPrefix?: string;
  setSuffix?: string;
  setConnector?: string;
  topLevelPrefix?: string;
  topLevelConnector?: string;
}

export function structuredTextToString(
  text: StructuredText, 
  subsets: string[][], 
  properties: Record<string, PlanProperty>){
    let s = text.mainText + '\n';
    if(text.includeComputation){
      subsets.forEach(subset => { 
        s += text.setPrefix ?? '' + ' \n ' ;
        s += '- ' + subset.map(pId => properties[pId].name).join(text.setConnector) + ' \n ';
        s += text.setSuffix ?? '' + ' \n ' ;
      });
    }
    return s;
}

export type ExplanationMessage = {
  iterationStepId: string;
  message: StructuredText;
  propertyId?: string;
  questionType: QuestionType;
  role: Role;
  conflictSets?: string[][];
};

