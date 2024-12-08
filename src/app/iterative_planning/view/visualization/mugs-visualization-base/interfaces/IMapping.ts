/**
 * An Interface depicting the mapping of each goal inside the set of MUG to its properties.
 *
 * * Properties:
 *  * - Goal: The name of the goal.
 *  * - ConflictSets: A two-dimensional array of MUG containing the goal.
 *  * - Color: A string representing the color associated with the goal, for visualization purposes.
 *  * - HeatMap: An array of tuples, each containing a goal and the number of times it interacts with the current goal.
 */
interface MUGMapping {
  Goal : string;
  ConflictSets : string[][];
  Color: string;
  HeatMap : [string, number][];
}

export {MUGMapping};
