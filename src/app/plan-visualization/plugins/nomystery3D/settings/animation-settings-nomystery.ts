
interface Position {
  x: number;
  y: number;
}

export class AnimationSettingsNoMystery {

  public locationPositions: Map<string, Position> = null;

  constructor(jsonString: string) {
    const jsonObject = JSON.parse(jsonString);
    this.locationPositions = new Map(jsonObject.locationPositions);
  }

  toJSON(): string {
    let s = '{\n';
    s += '\"locationPositions\": ';
    s += JSON.stringify([...this.locationPositions]);
    s += '}\n';
    return s;
  }

}
