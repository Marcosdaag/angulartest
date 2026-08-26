import { Counter } from './pages/counter/counter';
import { Dragonball } from './pages/dragonball/dragonball';
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
    path: 'dragonball',
    component: Dragonball
  },
  {
    path: '**',
    redirectTo: ''
  }
];
