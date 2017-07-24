import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from './../core/services/common/auth-guard.service';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login', loadChildren: 'app/pages/login/login.module#LoginModule',
  },
  {
    path: 'register', loadChildren: 'app/pages/register/register.module#RegisterModule',
  },
  {
    path: 'pages', component: Pages,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard] },
      { path: 'editors', loadChildren: './editors/editors.module#EditorsModule', canActivate: [AuthGuard] },
      { path: 'components', loadChildren: './components/components.module#ComponentsModule', canActivate: [AuthGuard] },
      { path: 'charts', loadChildren: './charts/charts.module#ChartsModule', canActivate: [AuthGuard] },
      { path: 'ui', loadChildren: './ui/ui.module#UiModule', canActivate: [AuthGuard] },
      { path: 'forms', loadChildren: './forms/forms.module#FormsModule', canActivate: [AuthGuard] },
      { path: 'tables', loadChildren: './tables/tables.module#TablesModule', canActivate: [AuthGuard] },
      { path: 'maps', loadChildren: './maps/maps.module#MapsModule', canActivate: [AuthGuard] },
      { path: 'users', loadChildren: './users/users.module#UsersModule', canActivate: [AuthGuard] },
      { path: 'peoples', loadChildren: './peoples/peoples.module#PeoplesModule', canActivate: [AuthGuard] },
      { path: 'activities', loadChildren: './activity/activity.module#ActivityModule', canActivate: [AuthGuard] },
      { path: 'reports', loadChildren: './reports/reports.module#ReportsModule', canActivate: [AuthGuard] },
      { path: 'settings', loadChildren: './settings/settings.module#SettingsModule', canActivate: [AuthGuard] },
      { path: 'no-permission', 
        loadChildren: './no-permission/no-permission.module#NoPermissionModule', canActivate: [AuthGuard] },
      { path: 'points', loadChildren: './points/points.module#PointsModule', canActivate: [AuthGuard] },
      { path: 'test', loadChildren: './test/test.module#TestModule', canActivate: [AuthGuard] },
    ],
    canActivate: [AuthGuard],
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
