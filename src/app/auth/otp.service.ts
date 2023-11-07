import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class OtpService {
  sendMessage(incoming_id: string, message: string) {
    throw new Error('Method not implemented.');
  }

  constructor() { }
}
