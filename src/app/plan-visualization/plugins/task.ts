import { TaskSchema } from '../../interface/task-schema';


export class Task {

  protected taskSchema: TaskSchema;

  constructor(taskSchema: TaskSchema) {
    this.taskSchema = taskSchema;
  }
}
