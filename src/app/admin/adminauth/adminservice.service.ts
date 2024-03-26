import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { backendUrl } from 'src/app/constant';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminserviceService {

  // private apiUrl = 'https://job4jobless.com:9001/';
  private apiUrl = `${backendUrl}`;

  constructor(private http: HttpClient) {}

  // loginCheck(formData: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}adminLoginCheck`, formData);
  // }

  loginCheck(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}adminLoginCheck`, formData).pipe(
      map((response: any) => response),
      catchError((error) => {
        console.error('Error during loginCheck:', error);
        let errorMessage = 'An error occurred during loginCheck';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else if (error.status === 401) {
          errorMessage = 'Invalid admin credentials';
        } else if (error.status === 500) {
          errorMessage = 'Internal server error';
        }

        return throwError(errorMessage);
      })
    );
  }

  subadminLoginCheck(formData: any): Observable<any> {
    console.log("I am authenticating sub admin")
    return this.http.post(`${this.apiUrl}subadmindetails/subadminLoginCheck`, formData).pipe(
      map((response: any) => response),
      catchError((error) => {
        console.error('Error during loginCheck:', error);
        let errorMessage = 'An error occurred during loginCheck';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else if (error.status === 401) {
          errorMessage = 'Invalid admin credentials';
        } else if (error.status === 500) {
          errorMessage = 'Internal server error';
        }else{
          console.log("Reponse is: ")
        }

        return throwError(errorMessage);
      })
    );
  }

  fetchAdminData(): Observable<any> {
    return this.http.get(`${this.apiUrl}fetchadmin`);
  }


 fetchContacts(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}fetchcontactfront`);
}

addQuestion(questionData: any) {
  return this.http.post(`${this.apiUrl}add`,  questionData);
}

}
