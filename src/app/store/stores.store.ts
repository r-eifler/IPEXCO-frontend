import { ViewSettings } from './../interface/view-settings';
import {ListStore} from './generic-list.store';
import {PDDLFile, DomainSpecificationFile} from '../interface/files';
import {ItemStore} from './generic-item.store';
import {PlanProperty} from '../interface/plan-property';
import {Project} from '../interface/project';
import {PlanRun, ExplanationRun} from '../interface/run';
import { TaskSchema} from '../interface/schema';
import { DomainSpecification} from '../interface/domain-specification';
import { Plan } from '../interface/plan';


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

export class PlanPropertyCollectionStore extends  ListStore<PlanProperty> {

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


