import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, CanActivateChild } from '@angular/router';

import { CredentialsService } from './credentials.service';
import { ModalService } from '@app/shared/modal/modal.service';
import { allRoles, defaultRole } from '../models/roles';
import { some, includes } from 'lodash';

@Injectable()
export class RoleGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private router: Router, private credentialsService: CredentialsService, private modalService: ModalService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivateItem(route, state);
  }

  async canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivateItem(childRoute, state);
  }

  canLoad(route: Route): boolean {
    if (!this.checkUserRoleForRoute(route)) {
      this.router.navigate(['/'], { replaceUrl: true });
      this.modalService.alert('A kért felület megtekintéséhez nincs joga!', 'Figyelmeztetés');
      return false;
    }

    return true;
  }

  private async canActivateItem(routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // Role
    if (
      routeSnapshot.routeConfig.data &&
      routeSnapshot.routeConfig.data.allowedRoles &&
      routeSnapshot.routeConfig.data.allowedRoles.length &&
      !this.checkUserRoleForRoute(routeSnapshot.routeConfig)
    ) {
      this.modalService
        .alert('A kért felület megtekintéséhez nincs joga!', 'Figyelmeztetés')
        .afterClosed()
        .subscribe(x => {
          this.router.navigate(['/'], { replaceUrl: true });
        });
      return false;
    }

    return true;
  }

  private checkUserRoleForRoute(route: Route) {
    if (!this.credentialsService.isAuthenticated()) {
      return false;
    }

    const allowedRoles = (route.data && route.data.allowedRoles && route.data.allowedRoles.length
      ? route.data.allowedRoles
      : allRoles()) as string[];

    const roles = [defaultRole()];

    return some(allowedRoles, x => includes(roles, x));
  }
}
