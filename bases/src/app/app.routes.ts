import { Counter } from './pages/counter/counter';
import { Dragonball } from './pages/dragonball/dragonball';
import { Dragonbalsuper } from './pages/dragonbalsuper/dragonballsuper';
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
    path: 'dragonballsuper',
    component: Dragonbalsuper
  },
  {
    path: '**',
    redirectTo: ''
  }
];
