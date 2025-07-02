import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { array, boolean } from "zod";
import { FileUpload, FileUploadZ, TestSuite, TestSuiteBase, TestSuiteZ } from "../domain/tests";


@Injectable({
    providedIn: 'root'
})
export class PolicyTestingTestCollectionsService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "policy-testing/";

    getTestCollections$(projectId: string): Observable<TestSuite[]> {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('projectId', projectId);

        return this.http.get<unknown>(this.BASE_URL, { params: httpParams }).pipe(
            map((data) => array(TestSuiteZ).parse(data)),
        )
    }

    getTestCollection$(id: string): Observable<TestSuite> {
        return this.http.get<unknown>(this.BASE_URL + id).pipe(
            map((data) => TestSuiteZ.parse(data)),
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

    postTestCollection$(testCollection: TestSuiteBase): Observable<TestSuite> {
        return this.http.post<unknown>(this.BASE_URL, testCollection).pipe(
            map((data) => TestSuiteZ.parse(data)),
        )
    }

    resetTestSuite$(tesSuiteId: string): Observable<TestSuite> {
        return this.http.put<unknown>(this.BASE_URL + tesSuiteId + '/reset', {}).pipe(
            map((data) => TestSuiteZ.parse(data)),
        )
    }

    startFuzzing$(testSuiteId: string, numberOfFuzzedStates: number): Observable<TestSuite> {
        return this.http.post<unknown>(this.BASE_URL + testSuiteId + '/start-fuzzing', {numberOfFuzzedStates}).pipe(
            map((data) => TestSuiteZ.parse(data)),
        )
    }
}