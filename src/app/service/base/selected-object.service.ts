import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LOAD, REMOVE } from "../../store/generic-list.store";
import { ItemStore } from "../../store/generic-item.store";
import { Identifiable } from "./object-collection.service";

@Injectable({
  providedIn: "root",
})
export class SelectedObjectService<T extends Identifiable> {
  selectedObjectStore: ItemStore<T>;

  constructor(selectedObjectStore: ItemStore<T>) {
    this.selectedObjectStore = selectedObjectStore;
    this.selectedObject$ = selectedObjectStore.item$;
  }

  selectedObject$: BehaviorSubject<T>;

  findSelectedObject() {
    return this.selectedObject$;
  }

  getSelectedObject(): BehaviorSubject<T> {
    return this.selectedObject$;
  }

  updateIfSame(obj: T) {
    if (this.selectedObject$.getValue() && this.selectedObject$.getValue()._id == obj._id) {
      this.selectedObjectStore.dispatch({ type: LOAD, data: obj });
    }
  }

  saveObject(obj: T) {
    this.selectedObjectStore.dispatch({ type: LOAD, data: obj });
  }

  deleteObject(obj: T) {
    this.selectedObjectStore.dispatch({ type: REMOVE, data: obj });
  }

  removeCurrentObject() {
    this.selectedObjectStore.dispatch({
      type: REMOVE,
      data: this.selectedObject$.getValue(),
    });
  }
}
