import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { backendUrl } from '../constant';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private backend_URL=`${backendUrl}`;
  
  static accessToken: string = '';
  private refresh: boolean = false; // Define the 'refresh' property here

  constructor(private http: HttpClient) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // console.log('Intercepting request...');
    // console.log('Access Token:', AuthInterceptor.accessToken);

    const req = request.clone({
      setHeaders: {
        Authorization: `Bearer ${AuthInterceptor.accessToken}`
      }
    });

    return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !this.refresh) { // Use 'this.refresh' to access the property
        this.refresh = true;

        // Make a request to refresh the access token
        return this.http.post(`${this.backend_URL}refresh`, {}, { withCredentials: true }).pipe(
          switchMap((res: any) => {
            AuthInterceptor.accessToken = res.accessToken;

            // Clone the original request with the new access token
            const newRequest = request.clone({
              setHeaders: {
                Authorization: `Bearer ${AuthInterceptor.accessToken}`
              }
            });

            this.refresh = false;

            return next.handle(newRequest);
          })
        );
      }

      return throwError(() => err);
    }));
  }
}