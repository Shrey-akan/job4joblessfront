import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminserviceService {

  private apiUrl = 'https://job4jobless.com:9001/';

  constructor(private http: HttpClient) {}

  loginCheck(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}admin/logincheck`, formData);
  }
  // Add a method to fetch admin data
  fetchAdminData(): Observable<any> {
    return this.http.get(`${this.apiUrl}fetchadmin`);
  }

 // Define a method to fetch data from the backend
 fetchContacts(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}fetchcontactfront`);
}

addQuestion(questionData: any) {
  return this.http.post(`${this.apiUrl}add`,  questionData);
}

}
