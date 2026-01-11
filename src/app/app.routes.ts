import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Actors } from './pages/actors/actors';
import { Movies } from './pages/movies/movies';
import { authGuard } from './auth/auth-guard';
import {ActorAppearances} from './pages/actor-appearance/actor-appearance';
import {MovieDetails} from './pages/moviedetail/moviedetail';
import { Logout } from './auth/logout';


export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login },
  { path: 'actors', component: Actors, canActivate: [authGuard] },
  { path: 'logout', component: Logout, canActivate: [authGuard] },
  { path: 'actors/:id/appearances', canActivate:[authGuard] , component: ActorAppearances },
  { path: 'movies', component: Movies, canActivate: [authGuard] },
  { path: 'movies/:id', canActivate:[authGuard] , component: MovieDetails },
  { path: '**', redirectTo: 'actors' }
];
