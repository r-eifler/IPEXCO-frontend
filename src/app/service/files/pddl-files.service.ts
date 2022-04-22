import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { IHTTPData } from "../../interface/http-data.interface";

import { File } from "../../interface/files/files";
import { environment } from "../../../environments/environment";
import {
  ADD,
  EDIT,
  ListStore,
  LOAD,
  REMOVE,
} from "../../store/generic-list.store";

import { Observable } from "rxjs";

const BASE_URL = environment.apiURL + "pddl-file/";

@Injectable()
export class FilesService {
  type = "";
  private http: HttpClient;
  private filesStore: ListStore<File>;

  constructor(http: HttpClient, filesStore: ListStore<File>) {
    this.http = http;
    this.filesStore = filesStore;
    this.files$ = filesStore.items$;
  }

  files$: Observable<File[]>;

  findFiles(query = "", sort = "id", order = "ASC") {
    const httpParams = new HttpParams();
    httpParams.append("q", query);
    httpParams.append("_sort", sort);
    httpParams.append("_order", order);

    this.http
      .get<IHTTPData<File>>(BASE_URL + "type/" + this.type + "/", {
        params: httpParams,
      })
      .subscribe((res) => {
        this.filesStore.dispatch({ type: LOAD, data: res.data });
      });

    return this.files$;
  }

  getFile(id: number | string): Observable<IHTTPData<File>> {
    return this.http.get<IHTTPData<File>>(BASE_URL + id);
  }

  saveFile(file: File) {
    const formData = new FormData();
    formData.append("content", file.content);
    formData.append("name", file.name);
    formData.append("domain", file.domain);
    formData.append("type", file.type);

    if (file._id) {
      return this.http
        .put<IHTTPData<File>>(BASE_URL + file._id, formData)
        .subscribe((httpData) => {
          const action = { type: EDIT, data: httpData.data };
          this.filesStore.dispatch(action);
        });
    }

    return this.http
      .post<IHTTPData<File>>(BASE_URL, formData)
      .subscribe((httpData) => {
        const action = { type: ADD, data: httpData.data };
        this.filesStore.dispatch(action);
      });
  }

  deleteFile(domainFile: File) {
    return this.http.delete(BASE_URL + domainFile._id).subscribe((response) => {
      this.filesStore.dispatch({ type: REMOVE, data: domainFile });
    });
  }
}
