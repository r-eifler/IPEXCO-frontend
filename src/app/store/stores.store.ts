import {ListStore} from './generic-list.store';
import {PDDLFile} from '../interface/pddlfile';
import {ItemStore} from './generic-item.store';
import {PlanProperty} from '../interface/plan-property';
import {Project} from '../interface/project';
import {PlanRun, ExplanationRun} from '../interface/run';
import { TaskSchema} from '../interface/schema';


export class DomainFilesStore extends  ListStore<PDDLFile> {

}

export class SelectedDomainFileStore extends  ItemStore<PDDLFile> {

}

export class ProblemFilesStore extends  ListStore<PDDLFile> {

}

export class SelectedProblemFileStore extends  ItemStore<PDDLFile> {

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

export class CurrentSchemaStore extends  ItemStore<TaskSchema> {

}


