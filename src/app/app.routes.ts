import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'todo',
    loadComponent: () => import('./todo/todo.component').then(m => m.TodoComponent)
  },
  {
    path: '**',
    redirectTo: 'todo'
  }
];
