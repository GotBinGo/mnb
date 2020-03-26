import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { LoginComponent } from '@app/core/login/login.component';
import { ErrorComponent } from '@app/core/error/error.component';
import { AuthenticationGuard } from './core/authentication/authentication.guard';
import { RoleGuard } from './core/authentication/role.guard';
import { NoAuthenticationGuard } from './core/authentication/no-authentication.guard';
import { KioskComponent } from './core/kiosk/kiosk.component';
import { Roles } from './core/models/roles';

const routes: Routes = [
  { path: 'kiosk', component: KioskComponent },
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
    {
      path: 'links',
      canLoad: [AuthenticationGuard, RoleGuard],
      loadChildren: () => import('./links/links.module').then(x => x.LinksModule),
      data: { allowedRoles: [] }
    },
    {
      path: 'hr',
      canLoad: [AuthenticationGuard, RoleGuard],
      loadChildren: () => import('./hr/hr.module').then(x => x.HrModule),
      data: {
        allowedRoles: [Roles.HR]
      }
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
