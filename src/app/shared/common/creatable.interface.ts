export enum CreationState {
    Default= 'Default', 
    Pending = 'Pending',
    Done = 'Done',
    Error = 'Error'
}

export interface Creatable<T> {
    state: CreationState,
    data: T | undefined
}