import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGaurdGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const loggedIn = localStorage.getItem('userName');
  if(loggedIn) {
    return true;
  }
  return router.navigate(['/rent-hub/home']);
};
