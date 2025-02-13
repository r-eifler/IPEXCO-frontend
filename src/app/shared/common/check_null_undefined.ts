import { filter, Observable } from "rxjs";

export function inputIsNotNullOrUndefined<T>(input: null | undefined | T): input is T {
    return input !== null && input !== undefined;
  }
  
export function isNotNullOrUndefined<T>() {
  return (source$: Observable<null | undefined | T>) =>
    source$.pipe(
      filter(inputIsNotNullOrUndefined)
    );
}


export function allNotNullOrUndefined<T>() {
  return (source$: Observable<(null | undefined | T)[]>) =>
    source$.pipe(
      filter((list) => list.every(inputIsNotNullOrUndefined))
    );
}