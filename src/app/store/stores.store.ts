import { MapStore } from './generic-map.store';
import { ExecutionSettings } from './../interface/execution-settings';
import { DisplayTask } from './../interface/display-task';
import { ViewSettings } from './../interface/view-settings';
import {ListStore} from './generic-list.store';
import {PDDLFile, DomainSpecificationFile} from '../interface/files';
import {ItemStore} from './generic-item.store';
import {PlanProperty} from '../interface/plan-property';
import {Project} from '../interface/project';
import {PlanRun, ExplanationRun} from '../interface/run';
import { TaskSchema} from '../interface/task-schema';
import { DomainSpecification} from '../interface/domain-specification';
import { Plan } from '../interface/plan';
import { Demo } from '../interface/demo';
import { User } from '../interface/user';


export class DomainFilesStore extends  ListStore<PDDLFile> {

}

export class SelectedDomainFileStore extends  ItemStore<PDDLFile> {

}

export class ProblemFilesStore extends  ListStore<PDDLFile> {

}

export class SelectedProblemFileStore extends  ItemStore<PDDLFile> {

}

export class DomainSpecificationFilesStore extends  ListStore<DomainSpecificationFile> {

}

export class PlanPropertyMapStore extends  MapStore<string, PlanProperty> {

}

export class ProjectsStore extends  ListStore<Project> {

}

export class CurrentProjectStore extends  ItemStore<Project> {

}

export class RunsStore extends  ListStore<PlanRun> {

}

export class CurrentRunStore extends  ItemStore<PlanRun> {

}

export class CurrentQuestionStore extends  ItemStore<ExplanationRun> {

}

export class TasktSchemaStore extends  ItemStore<TaskSchema> {

}

export class DomainSpecStore extends  ItemStore<DomainSpecification> {

}

export class ViewSettingsStore extends ItemStore<ViewSettings> {

}

export class CurrentPlanStore extends  ItemStore<Plan> {

}

export class DisplayTaskStore extends  ItemStore<DisplayTask> {

}

export class DemosStore extends  ListStore<Demo> {

}

export class RunningDemoStore extends  ItemStore<Demo> {

}

export class UserStore extends  ItemStore<User> {

}

export class ExecutionSettingsStore extends  ItemStore<ExecutionSettings> {

}


