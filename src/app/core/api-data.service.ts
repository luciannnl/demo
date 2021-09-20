import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from '@core/error-handler.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '@env/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ApiDataService {
  apiBaseUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  post<T, R>(endpoint: string, data: T): Observable<R> {
    return this.http
      .post<R>(`${this.apiBaseUrl}/${endpoint}`, data)
      .pipe(catchError(this.errorHandler.handleError));
  }
}
