import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


// If no JWT is in localStorage the user is sent to /login and navigation is blocked
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (localStorage.getItem('token')) {
    return true; // Token present — allow the route to render
  }

  router.navigate(['/login']); // No token — redirect to login
  return false;
};