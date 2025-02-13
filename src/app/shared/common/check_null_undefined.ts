import { filter, map, Observable, pipe, UnaryFunction } from "rxjs";

  
export function filterNotNullOrUndefined<T>() {
  return pipe(
    filter((v: null | undefined | T) => v !== null && v != undefined),
    map(v => v as T),
  );
}


export function filterListNotNullOrUndefined<A,B>() : 
  UnaryFunction<Observable<[null | undefined |A, null | undefined |B]>,
  Observable<[A,B]>>;
export function filterListNotNullOrUndefined<A,B,C>() : 
  UnaryFunction<Observable<[null | undefined |A, null | undefined |B,null | undefined |C]>,
  Observable<[A,B,C]>>;

export function filterListNotNullOrUndefined() {
  return pipe(
    filter((list: (null | undefined | any)[]) => 
      list !== null && list != undefined &&
       list.every(e =>  e !== null && e != undefined)
    ),
    map(v => v as any),
  );
}


