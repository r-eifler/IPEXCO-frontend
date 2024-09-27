export enum LoadingState {
    Initial = 'Initial', 
    Loading = 'Loading',
    Done = 'Done',
    Error = 'Error'
}

export interface Loadable<T> {
    state: LoadingState,
    data: T | undefined
}