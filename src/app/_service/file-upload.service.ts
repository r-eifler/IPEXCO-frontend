import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from  '@angular/common/http';
import { map } from  'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  SERVER_URL = 'http://localhost:4200/api/pddl-file';
  constructor(private httpClient: HttpClient) { }

  public upload(formData) {
    console.log('Upload file');
    return this.httpClient.post<any>(this.SERVER_URL, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

}
