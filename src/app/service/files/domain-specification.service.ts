import {Injectable} from '@angular/core';
import {DomainSpecification} from '../../interface/files/domain-specification';
import {ItemStore, LOAD} from '../../store/generic-item.store';
import {BehaviorSubject, Observable} from 'rxjs';
import {Project} from '../../interface/project';
import {HttpClient} from '@angular/common/http';
import {DomainSpecStore} from '../../store/stores.store';

@Injectable({
  providedIn: 'root'
})
export class DomainSpecificationService {

  private selectedObjectStore: ItemStore<DomainSpecification>;

  constructor(private http: HttpClient, selectedObjectStore: DomainSpecStore) {
    this.selectedObjectStore = selectedObjectStore;
    this.currentSpec$ = selectedObjectStore.item$;
  }

  private currentSpec$: BehaviorSubject<DomainSpecification>;

  findSpec(project: Project): Observable<DomainSpecification> {
    this.http.get<string>(project.domainSpecification.path).subscribe((res: string) => {
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
