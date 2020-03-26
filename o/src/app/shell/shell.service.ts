import { Routes, Route } from '@angular/router';

import { ShellComponent } from './shell/shell.component';
import { AuthenticationGuard } from '@app/core/authentication/authentication.guard';
import { RoleGuard } from '@app/core/authentication/role.guard';

/**
 * Provides helper methods to create routes.
 */
export class Shell {
  /**
   * Creates routes using the shell component and authentication.
   * @param routes The routes to add.
   * @return The new route using shell as the base.
   */
  static childRoutes(routes: Routes): Route {
    return {
      path: '',
      component: ShellComponent,
      children: routes,
      canActivate: [AuthenticationGuard],
      canActivateChild: [AuthenticationGuard, RoleGuard],
      // Reuse ShellComponent instance when navigating between child views
      data: { reuse: true }
    };
  }
}
