import { CanActivateFn } from '@angular/router';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const authGuard: CanActivateFn = (route, state) => {
  // Check if the user is authenticated based on the access token in AuthInterceptor
  if ((AuthInterceptor.accessToken)) {
    return true; 
  } else {
    // User is not authenticated, navigate to the login page
    // window.alert('You are not authenticated. Please log in to access this page.');
    // Navigate to the login page (you should replace '/login' with the actual login route)
    // window.location.href = '/login'; 
    return false; // Prevent access to the route
  }
};
