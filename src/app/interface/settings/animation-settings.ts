import { BehaviorSubject } from "rxjs";

export abstract class AnimationSettings {
  abstract displayElemObservable(): BehaviorSubject<Element[]>;
}
