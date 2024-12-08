import {generateRandomColor} from './utils';

export class ColorGenerator {
  private alreadyGeneratedColors: string[] = []

  public constructor() {
  }

  generateColor(): string {
    let color: string;
    do {
      color = generateRandomColor();
    } while (this.alreadyGeneratedColors.includes(color));
    this.alreadyGeneratedColors.push(color);
    return color;
  }


}
