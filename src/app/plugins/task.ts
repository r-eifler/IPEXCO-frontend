import { TaskSchema } from './../interface/schema';


export class Task {

  protected taskSchema: TaskSchema;

  constructor(taskSchema: TaskSchema) {
    this.taskSchema = taskSchema;
  }
}
