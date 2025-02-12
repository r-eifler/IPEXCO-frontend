export interface PlanningTask{
  _id? : string;
  name: string;
  model: BaseModel;
}  

export interface TaskObject {
  name: string,
  type: string,
}


export interface BaseModel {
  objects: TaskObject[]
}