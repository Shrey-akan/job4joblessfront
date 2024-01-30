import { CanActivateFn } from '@angular/router';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const authGuard: CanActivateFn = (route, state) => {
  if ((AuthInterceptor.accessToken)) {
    return true; 
  } else {
    return false;
  }
};
