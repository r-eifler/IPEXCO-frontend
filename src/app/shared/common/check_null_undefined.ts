import { filter, map, Observable, pipe, UnaryFunction } from "rxjs";

  
export function filterNotNullOrUndefined<T>() {
  return pipe(
    filter((v: null | undefined | T) => v !== null && v != undefined),
    map(v => v as T),
  );
}


export function filterListNotNullOrUndefined<A,B>() : 
  UnaryFunction<Observable<[null | undefined | A , null | undefined | B]>,
  Observable<[A,B]>>;
export function filterListNotNullOrUndefined<A,B,C>() : 
  UnaryFunction<Observable<[null | undefined | A, null | undefined | B, null | undefined | C]>,
  Observable<[A,B,C]>>;
export function filterListNotNullOrUndefined<A,B,C,D>() : 
  UnaryFunction<Observable<[null | undefined | A, null | undefined | B, null | undefined | C, null | undefined | D]>,
  Observable<[A,B,C,D]>>;
export function filterListNotNullOrUndefined<A,B,C,D,E>() : 
  UnaryFunction<Observable<[null | undefined | A, null | undefined | B, null | undefined | C, null | undefined | D, null | undefined | E]>,
  Observable<[A,B,C,D,E]>>;
export function filterListNotNullOrUndefined<A,B,C,D,E,F>() : 
  UnaryFunction<Observable<[null | undefined | A, null | undefined | B, null | undefined | C, null | undefined | D, null | undefined | E, null | undefined | F]>,
  Observable<[A,B,C,D,E,F]>>;


export function filterListNotNullOrUndefined() {
  return pipe(
    filter((list: (null | undefined | any)[]) => 
      list !== null && list != undefined &&
       list.every(e =>  e !== null && e != undefined)
    ),
    map(v => v as any),
  );
}


