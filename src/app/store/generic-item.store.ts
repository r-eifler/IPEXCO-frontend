import { BehaviorSubject } from "rxjs";

export const LOAD = "LOAD";
export const REMOVE = "REMOVE";

export class ItemStore<T> {
  item = null;
  item$ = new BehaviorSubject<T>(null);

  dispatch(action) {
    this.item = this._reduce(this.item, action);
    this.item$.next(this.item);
  }

  _reduce(item: T, action) {
    switch (action.type) {
      case LOAD:
        return action.data;
      case REMOVE:
        return null;
      default:
        return item;
    }
  }
}
