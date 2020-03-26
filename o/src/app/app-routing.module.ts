import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { LoginComponent } from '@app/core/login/login.component';
import { ErrorComponent } from '@app/core/error/error.component';
import { AuthenticationGuard } from './core/authentication/authentication.guard';
import { RoleGuard } from './core/authentication/role.guard';
import { NoAuthenticationGuard } from './core/authentication/no-authentication.guard';

const routes: Routes = [
  { canActivate: [NoAuthenticationGuard], path: 'login', component: LoginComponent },
  Shell.childRoutes([
    {
      path: '',
      loadChildren: () => import('./home/home.module').then(x => x.HomeModule),
      data: { allowedRoles: [] },
      pathMatch: 'full'
    },
    {
      path: 'guideline',
      canLoad: [AuthenticationGuard, RoleGuard],
      loadChildren: () => import('./design-guideline/design-guideline.module').then(x => x.DesignGuidelineModule),
      data: { allowedRoles: [] }
    },
    {
      path: 'events',
      canLoad: [AuthenticationGuard, RoleGuard],
      loadChildren: () => import('./events/events.module').then(x => x.EventsModule),
      data: { allowedRoles: [] }
    },
    {
      path: 'ettermek',
      canLoad: [AuthenticationGuard, RoleGuard],
      loadChildren: () => import('./etterem/etterem.module').then(x => x.EtteremModule),
      data: { allowedRoles: [] }
    },
    {
      path: 'tickets',
      canLoad: [AuthenticationGuard, RoleGuard],
      loadChildren: () => import('./tickets/tickets.module').then(x => x.TicketsModule),
      data: { allowedRoles: [] }
    },
    { path: 'error', component: ErrorComponent }
  ]),
  // Fallback when no prior route is matched
  // { path: '**', redirectTo: '', pathMatch: 'full' }
  { path: '**', redirectTo: '/error?code=404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
