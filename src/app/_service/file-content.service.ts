import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {PDDLFile} from '../_interface/pddlfile';
import {Observable} from 'rxjs';

interface FileContent {
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileContentService {

  constructor(private http: HttpClient) { }

  getFileContent(file: PDDLFile): Observable<string> {
    return this.http.get(file.path, {responseType: 'text'});
  }
}
