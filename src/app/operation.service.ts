import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs/Observable';
import {CLActive} from './models/index';
import {CLChange} from './models/index';

const httpOptionsForPost = {
     headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};



@Injectable()
export class OperationService {
  private documentsUrl = 'http://localhost:80/';  // URL to local web api
  // private documentsUrl = 'http://140.188.65.80/';  // URL to web api
  constructor(
    private http: HttpClient) {}

    getActives(): Observable<CLActive[]> {
      return this.http.get<CLActive[]>(this.documentsUrl + 'list/CLRequestActive');
    }

    getChanges(): Observable<CLChange[]> {
      return this.http.get<CLChange[]>(this.documentsUrl + 'list/CLRequestChange');
    }

    getRequestTags(): Observable<any[]> {
      return this.http.get<any[]>(this.documentsUrl + 'get/requestTag');
    }

    getRequestValues(): Observable<any[]> {
      return this.http.get<any[]>(this.documentsUrl + 'get/requestValue');
    }

    getRequestTagsLevel2(): Observable<any[]> {
      return this.http.get<any[]>(this.documentsUrl + 'get/requestTagLevel2');
    }

    getRequestValuesLevel2(): Observable<any[]> {
      return this.http.get<any[]>(this.documentsUrl + 'get/requestValueLevel2');
    }

    addActive(clActive: CLActive): Observable<any> {
      return this.http.post<any>(this.documentsUrl + 'add/CLRequestActive', clActive, httpOptionsForPost);
    }

    editActive(clActive: CLActive): Observable<any> {
      return this.http.post<any>(this.documentsUrl + 'edit/CLRequestActive', clActive, httpOptionsForPost);
    }

    deleteActiveTag(clActive: CLActive): Observable<any> {
      return this.http.post<any>(this.documentsUrl + 'delete/CLRequestActive/requestTag', clActive, httpOptionsForPost);
    }

    deleteActiveValue(clActive: CLActive): Observable<any> {
      return this.http.post<any>(this.documentsUrl + 'delete/CLRequestActive/requestValue', clActive, httpOptionsForPost);
    }

    deleteActiveTag2(clActive: CLActive): Observable<any> {
      return this.http.post<any>(this.documentsUrl + 'delete/CLRequestActive/requestTagLevel2', clActive, httpOptionsForPost);
    }

    deleteActiveValue2(clActive: CLActive): Observable<any> {
      return this.http.post<any>(this.documentsUrl + 'delete/CLRequestActive/requestValueLevel2', clActive, httpOptionsForPost);
    }

    addChange(clChange: CLChange): Observable<any> {
      return this.http.post<any>(this.documentsUrl + 'add/CLRequestChange', clChange, httpOptionsForPost);
    }

    editChange(clChange: CLChange): Observable<any> {
      return this.http.post<any>(this.documentsUrl + 'edit/CLRequestChange', clChange, httpOptionsForPost);
    }

    downloadExcel(): Observable<any> {
      return this.http.get(this.documentsUrl + 'generate40xls/',  { responseType: 'blob' });
    }

}
