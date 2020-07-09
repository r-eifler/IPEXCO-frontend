import {BehaviorSubject} from 'rxjs';

export const LOAD = 'LOAD';
export const ADD = 'ADD';
export const EDIT = 'EDIT';
export const REMOVE = 'REMOVE';


type Id = string | number;
interface Identifiable {
  _id?: Id;
}


export class ListStore<T extends Identifiable> {
  items = [];
  items$ = new BehaviorSubject<T[]>([]);

  dispatch(action) {
    this.items = this._reduce(this.items, action);
    this.items$.next(this.items);
  }

  reset() {
    this.items = [];
    this.items$.next(this.items);
  }

  _reduce(items: T[], action) {
    switch (action.type) {
      case LOAD:
        return [...action.data];
      case ADD:
        return [...items, action.data];
      case EDIT:
        return items.map(task => {
          const editedItem = action.data;
          if (task._id !== editedItem._id) {
            return task;
          }
          return editedItem;
        });
      case REMOVE:
        return items.filter(task => task._id !== action.data._id);
      default:
        return items;
    }
  }
}
