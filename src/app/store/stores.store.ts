import {ListStore} from './generic-list.store';
import {PDDLFile} from '../_interface/pddlfile';
import {ItemStore} from './generic-item.store';
import {PlanProperty} from '../_interface/plan-property';
import {Project} from '../_interface/project';
import {Run} from '../_interface/run';
import {IterPlanningStep} from '../_interface/iter-planning-step';


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

export class RunsStore extends  ListStore<Run> {

}

export class IterPlanningStepStore extends  ListStore<IterPlanningStep> {

}
