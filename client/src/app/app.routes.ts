import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },

  // redirect to Home
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'comunities',
    loadComponent: () =>
      import('./components/comunities/comunities.component').then(
        (m) => m.ComunitiesComponent
      ),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./components/reports/reports.component').then(
        (m) => m.ReportsComponent
      ),
  },

  {
    path: 'activities',
    loadComponent: () =>
      import('./components/activities/activities.component').then(
        (m) => m.ActivitiesComponent
      ),
  },
  {path: 'auditoria',
    loadComponent:() =>
      import('./components/auditoria/auditoria.component').then(
        (m) => m.AuditoriaComponent
      ),

  },

  // users paths

  {
    path: 'profile',
    loadComponent: () =>
      import('./components/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },

  {
    path: 'sign-up',
    loadComponent: () =>
      import('./components/sign-up/sign-up.component').then(
        (m) => m.SignUpComponent
      ),
  },

  // admin paths
  {
    path: 'admin',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'activities',
        loadComponent: () =>
          import(
            './components/admin/crud-activities/crud-activities.component'
          ).then((m) => m.CrudActivitiesComponent),
      },
    ],
  },

  // zone vitae paths

  {
    path: 'about',
    loadComponent: () =>
      import('./components/about/about.component').then(
        (m) => m.AboutComponent
      ),
  },

  {
    path: 'helps',
    loadComponent: () =>
      import('./components/helps/helps.component').then(
        (m) => m.HelpsComponent
      ),
  },

  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
