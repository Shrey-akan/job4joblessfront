import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MessagingService } from './firebase/messaging.service';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient,private router:Router, private cookie: CookieService , private messagingservice:MessagingService) {   }
  title = 'job4jobless';
  showFooter = true;

  message:any = null;
  ngOnInit():void {
   
    const refreshToken = this.cookie.get('refreshToken');
    if (refreshToken) {
      this.http.post('https://job4jobless.com:9001/refreshToken', { refreshToken }).subscribe(
       {
        next:(response: any) => {
          if (response.accessToken) {
            const accessToken = response.accessToken;
            this.redirectToDashboard(response.role, response.uid, response.empid,response.adminid , response.accessToken);

          }
        },
        error:(error) => {
         this.router.navigate(['/login']);
        }
       }
      );
    }
    this.requestPermission();
    this.listen();
  }
  redirectToDashboard(role: string, uid: string, empid: string, adminid:string ,accessToken:string) {
    if (role === 'user') {
      AuthInterceptor.accessToken = accessToken;
      this.cookie.set('accessToken', accessToken);
      this.cookie.set('uid', uid);
      this.router.navigate(['/dashboarduser']);
    } else if (role === 'employer') {
      AuthInterceptor.accessToken = accessToken;
      this.cookie.set('accessToken', accessToken);
      this.cookie.set('emp', empid); 
      this.router.navigate(['/dashboardemp']);
    } else if(role === 'admin'){
      AuthInterceptor.accessToken = accessToken;
      this.cookie.set('accessToken', accessToken);
      this.cookie.set('adminid', adminid); 
      this.router.navigate(['/admin']);
    }
  }
  
  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: environment.firebase.vapidKey })
      .then((currentToken) => {
        if (currentToken) {
          this.sendTokenToAPI(currentToken);
        } else {
        }
      })
      .catch((err) => {
      });
  }


  sendTokenToAPI(token: string) {
    const apiUrl = 'https://rocknwoods.website:4000/api/settoken';
    const tokenid = generateRandomTokenId();
    this.http.post(apiUrl, { token, tokenid }).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error) => {
      }
    });

    function generateRandomTokenId() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const length = 10;
      let randomTokenId = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomTokenId += characters.charAt(randomIndex);
      }
      return randomTokenId;
    }
  }
  


  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      this.message = payload;
    });
  }
}
