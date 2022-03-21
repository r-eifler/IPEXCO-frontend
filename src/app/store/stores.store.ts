import { IterationStep } from './../interface/run';
import {MapStore} from './generic-map.store';
import {ExecutionSettings} from '../interface/settings/execution-settings';
import {ViewSettings} from '../interface/settings/view-settings';
import {ListStore} from './generic-list.store';
import {DomainSpecificationFile, PDDLFile} from '../interface/files/files';
import {ItemStore} from './generic-item.store';
import {PlanProperty} from '../interface/plan-property/plan-property';
import {Project} from '../interface/project';
import {DepExplanationRun, PlanRun} from '../interface/run';
import {TaskSchema} from '../interface/task-schema';
import {DomainSpecification} from '../interface/files/domain-specification';
import {Demo} from '../interface/demo';
import {User} from '../interface/user';
import {UserStudy} from '../interface/user-study/user-study';
import {MetaStudy} from '../interface/user-study/meta-study';
import { PlanningTaskRelaxationSpace } from '../interface/planning-task-relaxation';


// User/Authentication
export class UserStore extends  ItemStore<User> {}


// Files
export class DomainFilesStore extends  ListStore<PDDLFile> {}
export class ProblemFilesStore extends  ListStore<PDDLFile> {}
export class DomainSpecificationFilesStore extends  ListStore<DomainSpecificationFile> {}


// Project
export class ProjectsStore extends  ListStore<Project> {}
export class CurrentProjectStore extends  ItemStore<Project> {}

// Plan-Properties
export class PlanPropertyMapStore extends  MapStore<string, PlanProperty> {}


// PlanRun and ExpRun
export class CurrentIterationStepStore extends  ItemStore<IterationStep> {}
export class IterationStepsStore extends  ListStore<IterationStep> {}
export class RunsStore extends  ListStore<PlanRun> {}
export class CurrentRunStore extends  ItemStore<PlanRun> {}
export class CurrentQuestionStore extends  ItemStore<DepExplanationRun> {}

// Additional Task Info
export class TaskSchemaStore extends  ItemStore<TaskSchema> {}
export class DomainSpecStore extends  ItemStore<DomainSpecification> {}

// Settings
export class ViewSettingsStore extends ItemStore<ViewSettings> {}
export class ExecutionSettingsStore extends  ItemStore<ExecutionSettings> {}

// Demo
export class DemosStore extends  ListStore<Demo> {}
export class RunningDemoStore extends  ItemStore<Demo> {}

// User Study
export class UserStudiesStore extends  ListStore<UserStudy> {}
export class RunningUserStudyStore extends  ItemStore<UserStudy> {}

// User Study
export class MetaStudiesStore extends  ListStore<MetaStudy> {}
export class SelectedMetaStudyStore extends  ItemStore<MetaStudy> {}

//Relaxations
export class PlanningTaskRelaxationsStore extends  ListStore<PlanningTaskRelaxationSpace> {}

