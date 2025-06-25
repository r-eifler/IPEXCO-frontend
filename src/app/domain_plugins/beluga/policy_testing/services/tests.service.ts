import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { array, boolean } from "zod";
import { FileUpload, FileUploadZ, TestCollection, TestCollectionBase, TestCollectionZ } from "../domain/test-case";


@Injectable({
    providedIn: 'root'
})
export class PolicyTestingTestCollectionsService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "policy-testing/";

    getTestCollections$(id: string): Observable<TestCollection[]> {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('projectId', id);

        return this.http.get<unknown>(this.BASE_URL, { params: httpParams }).pipe(
            map((data) => array(TestCollectionZ).parse(data)),
        )
    }

    uploadPolicy(file: File): Observable<FileUpload> {

        const formData = new FormData();
        formData.append('policy', file);

        console.log(file);
        console.log(formData);

        return this.http.post<unknown>(this.BASE_URL + 'upload/policy', formData).pipe(
            map((data) => FileUploadZ.parse(data))
        )
    }

    postTestCollection$(testCollection: TestCollectionBase): Observable<TestCollection> {
        return this.http.post<unknown>(this.BASE_URL, testCollection).pipe(
            map((data) => TestCollectionZ.parse(data)),
        )
    }
}