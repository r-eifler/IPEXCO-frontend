import {ListStore} from './generic-list.store';
import {PDDLFile} from '../_interface/pddlfile';
import {ItemStore} from './generic-item.store';
import {PlanProperty} from '../_interface/plan-property';
import {Project} from '../_interface/project';


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

export class PlanPropertyHardGoalStore extends  ListStore<PlanProperty> {

}

export class PlanPropertySoftGoalStore extends  ListStore<PlanProperty> {

}

export class ProjectStore extends  ListStore<Project> {

}
