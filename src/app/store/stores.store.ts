import {ListStore} from './generic-list.store';
import {PDDLFile} from '../_interface/pddlfile';
import {ItemStore} from './generic-item.store';


export class DomainFilesStore extends  ListStore<PDDLFile> {

}

export class SelectedDomainFileStore extends  ItemStore<PDDLFile> {

}
