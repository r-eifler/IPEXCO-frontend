/**
 * Processes a 2D array of strings and replaces all elements after the first occurrence
 * of a specified flag in each sub-array with a given replacement value.
 *
 * @param data - The 2D array of strings to process.
 * @param flag - The marker string.
 * @param replacement - The string used to replace elements after the flag.
 * @returns A 2D array where all elements after the flag in each row are replaced with the replacement value.
 */
function truncateAfterFirst(data: string[][], flag: string, replacement: string): string[][]{
  for (let i = 0; i < data.length; i++) {
    const indexOfFlag = data[i].indexOf(flag);
    if (indexOfFlag !== -1) {
      for (let j = indexOfFlag + 1; j < data[i].length; j++) {
        data[i][j] = replacement;
      }
    }
  }
  return data;
}


/**
 * Randomly returns string of color code (hex format).
 *
 * @returns A string representing the color code.
 */
function generateRandomColor(): string {
  let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  return color.padStart(7, "#");
}

export{truncateAfterFirst, generateRandomColor};
