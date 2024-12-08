import {MUGMapping} from "../interfaces/IMapping";
import {truncateAfterFirst} from './utils';
import {ColorGenerator} from './color-generator';

export class ComponentVisualizer{
  private readonly MUGS: string[][];
  private readonly MSGS: string[][];
  private readonly colorGenerator: ColorGenerator = new ColorGenerator()
  private mugMapping: MUGMapping[] = [];

  uniqueGoals: string[] = [];
  crossReference: string[][] = []

  public constructor(mugSet: string[][], msgSet: string[][]) {
    this.MUGS = mugSet;
    this.MSGS = msgSet;
    this.uniqueGoals = Array.from(new Set(this.MUGS.flat()));
    this.computeCrossReferenceValue();
  }

  computeCrossReference(): void{
    this.crossReference = this.uniqueGoals.map(
      row => this.uniqueGoals.map(
        col => this.fetchCrossReferenceValue(row, col)
      )
    )
    this.crossReference = truncateAfterFirst(this.crossReference, "", "");
  }

  private computeCrossReferenceValue(){
    for (let i = 0; i < this.uniqueGoals.length; i++) {

      const currentGoal = this.uniqueGoals[i];
      let mapping: MUGMapping = {
        Goal: currentGoal,
        ConflictSets: [],
        Color: this.colorGenerator.generateColor(),
        HeatMap: [],
      };

      for (let j = 0; j < this.MUGS.length; j++) {
        const mug = this.MUGS[j];

        if (!mug.includes(currentGoal)) continue;
        mapping.ConflictSets.push(mug);
        // let heatMapMap = new Map<string, number>();
        //
        // for (let z = 0; z < mug.length; z++) {
        //   const currentMugContent = mug[z];
        //
        //   if (currentGoal !== currentMugContent) {
        //     if (heatMapMap.has(currentMugContent)) {
        //       heatMapMap.set(currentMugContent, heatMapMap.get(currentMugContent)! + 1);
        //     } else {
        //       heatMapMap.set(currentMugContent, 1);
        //     }
        //   }
        // }
        // // Transfer from Map to HeatMap array
        // heatMapMap.forEach((value, key) => {
        //   mapping.HeatMap.push([key, value]);
        // });
      }
      this.mugMapping.push(mapping);
    }
    console.log("Component-Visualizer: MUG Mapping computation completed");
    console.log(this.mugMapping);
  }


  private fetchCrossReferenceValue(row: string, col: string): string{
    if (row == col){
      return "";
    }
    for (let i = 0; i < this.mugMapping.length; i++) {
      const mug = this.mugMapping[i];
      if (!(row == mug.Goal)) continue;
      const conflictSet: string[][] = mug.ConflictSets;

      if (conflictSet.some(pair =>
        (pair[0] == row && pair[1] == col) || (pair[1] == row && pair[0] == col)
      )){
        return "Full Red";
      }

      for (const set of conflictSet) {
        if (set.includes(row) && set.includes(col)) {
          return "Mid Red";
        }
      }

      return "Gray";
    }
  }


}


