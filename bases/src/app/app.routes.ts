import { Counter } from './pages/counter/counter';
import { Hero } from './pages/hero/hero';
import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    component: Counter
  },
  {
    path: 'hero',
    component: Hero
  },
  {
    path: '**',
    redirectTo: ''
  }
];
