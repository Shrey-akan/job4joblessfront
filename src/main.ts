import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { initializeApp } from 'firebase/app';
import { environment } from './environments/environment';

const firebaseConfig = environment.firebase;
const app = initializeApp(firebaseConfig);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service worker registered:', registration);
    })
    .catch((error) => {
      console.error('Service worker registration failed:', error);
    });
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


