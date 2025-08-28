import { Routes } from '@angular/router';
import { SignUp } from './auth/sign-up/sign-up';
import { Home } from './home-page/home/home';
import { NewPost } from './home-page/new-post/new-post';
import { ViewInfo } from './listings/view-info/view-info';
import { authGaurdGuard } from './auth-gaurd-guard';

export const routes: Routes = [
  { path: 'rent-hub/home', pathMatch: 'full', component: Home },
  { path: 'rent-hub/sign-up', pathMatch: 'full', component: SignUp },
  {
    path: 'rent-hub/view-post',
    pathMatch: 'full',
    loadComponent: () => import('./listings/view-info/view-info').then((m) => m.ViewInfo),
  },
  {
    path: 'rent-hub/create-new-post',
    pathMatch: 'full',
    loadComponent: () => import('./home-page/new-post/new-post').then((m) => m.NewPost),
    canActivate: [authGaurdGuard],
  },
  { path: '**', redirectTo: 'rent-hub/home' },
];
