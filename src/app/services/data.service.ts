import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, timeout } from 'rxjs/operators';
import { baseUrl } from '../shared/app-constant';
import * as FileSaver from 'file-saver';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  postReportExcelData(methodName: string) {
    return this.http
      .post(baseUrl + methodName, null, {
        responseType: 'arraybuffer',
        observe: 'response',
      })
      .pipe(
        catchError(this.handleError),
        timeout(300000),
        map((data) => {
          return data;
        })
      );
  }

  downloadFile(response: any) {
    let type = response.headers.get('Content-Type');
    let disposition = response.headers.get('content-disposition');
    let fileName = '';
    if (disposition) {
      const match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
      if (match[1]) {
        fileName = match[1];
        fileName = fileName.replace(/[<>:"\/\\|?*]+/g, '_');
      }
    }
    const blob = new Blob([response.body], {type: type});
    FileSaver.saveAs(blob, fileName);
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown Error!!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
