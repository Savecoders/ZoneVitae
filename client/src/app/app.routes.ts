import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

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
  path: 'crud-communities',
  loadComponent: () =>
    import('./components/crud-communities/crud-communities.component').then(
      (m) => m.CrudComunitiesComponent
    ),
  },
  {
  path: 'form-communities',
  loadComponent: () =>
    import('./components/form-community/form-community.component').then(
      (m) => m.FormCommunityComponent
    ),
  },
  {
  path: 'form-communities/:id',
  loadComponent: () =>
    import('./components/form-community/form-community.component').then(
      (m) => m.FormCommunityComponent
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

  // users paths

  {
    path: 'profile',
    loadComponent: () =>
      import('./components/user/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },

  // auth paths

  {
    path: 'auth',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./components/user/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },

      {
        path: 'sign-up',
        loadComponent: () =>
          import('./components/user/sign-up/sign-up.component').then(
            (m) => m.SignUpComponent
          ),
      },
    ],
  },

  // admin paths
  {
    path: 'admin',
    canActivate: [AuthGuard],
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

  // protected autoridy paths
  {
    path: 'auditoria',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/auditoria/auditoria.component').then(
        (m) => m.AuditoriaComponent
      ),
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
    path: 'unauthorized',
    loadComponent: () =>
      import('./components/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
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
