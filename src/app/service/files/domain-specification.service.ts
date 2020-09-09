import {Injectable} from '@angular/core';
import {DomainSpecification} from '../../interface/files/domain-specification';
import {ItemStore, LOAD} from '../../store/generic-item.store';
import {BehaviorSubject, Observable} from 'rxjs';
import {Project} from '../../interface/project';
import {HttpClient} from '@angular/common/http';
import {DomainSpecStore} from '../../store/stores.store';
import {environment} from '../../../environments/environment';
import {GoalType, PlanProperty} from '../../interface/plan-property/plan-property';

@Injectable({
  providedIn: 'root'
})
export class DomainSpecificationService {

  private selectedObjectStore: ItemStore<DomainSpecification>;

  constructor(private http: HttpClient, selectedObjectStore: DomainSpecStore) {
    this.selectedObjectStore = selectedObjectStore;
    this.currentSpec$ = selectedObjectStore.item$;
  }

  private readonly currentSpec$: BehaviorSubject<DomainSpecification>;

  findSpec(project: Project): Observable<DomainSpecification> {
    console.log(project.domainSpecification);
    const url = environment.srcURL + project.domainSpecification.path;
    this.http.get<string>(url).subscribe((res: string) => {
        // console.log('Domain Specification:');
        // console.log(res);
        const spec = new DomainSpecification(res);
        this.selectedObjectStore.dispatch({type: LOAD, data: spec});
      });
    return this.currentSpec$;
  }

  getSpec(): Observable<DomainSpecification> {
    return this.currentSpec$;
  }

}
