import { BehaviorSubject } from 'rxjs';

export const LOAD = 'LOAD';
export const ADD = 'ADD';
export const EDIT = 'EDIT';
export const REMOVE = 'REMOVE';


type Id = string | number;
interface Identifiable {
  _id?: Id;
}


export class MapStore<K, T extends Identifiable> {
  items = new Map<K, T>();
  items$ = new BehaviorSubject<Map<K, T>>(this.items);

  dispatch(action) {
    this.items = this._reduce(this.items, action);
    this.items$.next(this.items);
  }

  reset() {
    this.items = new Map<K, T>();
    this.items$.next(this.items);
  }

  _reduce(items: Map<K, T>, action): Map<K, T> {
    let newMap;
    switch (action.type) {
      case LOAD:
        return new Map(action.data);
      case ADD:
        newMap = new Map(items);
        return newMap.set(action.key, action.data);
      case EDIT:
        newMap = new Map(items);
        return newMap.set(action.key, action.data);
      case REMOVE:
        newMap = new Map(items);
        newMap.delete(action.key);
        return newMap;
      default:
        return items;
    }
  }
}
