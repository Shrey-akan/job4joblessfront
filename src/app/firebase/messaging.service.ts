import { supportsScrollBehavior } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { AngularFireMessaging } from '@angular/fire/compat/messaging';
// import { environment, messaging } from 'src/environments/environment';
// import { getToken } from 'firebase/messaging';
// import { initializeApp } from '@angular/fire/app';
@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  // currentMessage = new BehaviorSubject<any>(null);


  // constructor(private angularfire: AngularFireMessaging) {
  //   this.requestpermission();
  //  }
  //  async requestpermission() {
  //   if ('Notification' in window) {
  //     Notification.requestPermission().then(async (permission) => {
  //       if (permission === 'granted') {
  //         // Initialize Firebase with your environment configuration
  //         initializeApp(environment.firebase);

  //         // let token = await this.angularfire.getToken;
  //       //  await this.angularfire.getToken.subscribe({
  //       //   next:(payload:any) =>{
  //       //     if(payload==null){
  //       //       console.log("Value of Token is null");
  //       //     return;
  //       //     }
            
  //       //     console.log(payload);
  //       //   },
  //       //   error: (err) => {
  //       //     console.log(err);
            
  //       //   }
  //       //  });
  //       await this.angularfire.requestToken.subscribe({
  //         next:(payload:any) =>{
  //           if(payload==null){
  //             console.log("Value of Token is null");
  //           return;
  //           }
            
  //           console.log(payload);
  //         },
  //         error: (err) => {
  //           console.log(err);
            
  //         }
  //        })
  //         // console.log('FCM token shreyans:', token);

  //         // Call the function to save the token and handle it as needed
  //         // this.saveTokenAndHandle(token);
  //       } else if (permission === 'denied') {
  //         alert('You denied the notification permission.');
  //       }
  //     });
  //   }
  // }
}