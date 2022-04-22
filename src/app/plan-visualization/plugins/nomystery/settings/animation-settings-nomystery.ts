interface Position {
  x: number;
  y: number;
}

export class AnimationSettingsNoMystery {
  public locationPositions: Map<string, Position> = null;
  public locationDropPositions: Map<string, Position[]> = null;

  constructor(jsonString: string) {
    if (jsonString) {
      const jsonObject = JSON.parse(jsonString);
      this.locationPositions = new Map(jsonObject.locationPositions);
      this.locationDropPositions = new Map(jsonObject.locationDropPositions);
    } else {
      this.locationPositions = new Map();
      this.locationDropPositions = new Map();
    }
  }

  toJSON(): string {
    let s = "{\n";
    s += '"locationPositions": ';
    s += JSON.stringify([...this.locationPositions]);
    s += ",\n";
    s += '"locationDropPositions": ';
    s += JSON.stringify([...this.locationDropPositions]);
    s += "}\n";
    return s;
  }
}
