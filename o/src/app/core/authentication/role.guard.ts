import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, CanActivateChild } from '@angular/router';

import { CredentialsService } from './credentials.service';
import { ModalService } from '@app/shared/modal/modal.service';
import { allRoles } from '../models/roles';

@Injectable()
export class RoleGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private router: Router, private credentialsService: CredentialsService, private modalService: ModalService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivateItem(route, state);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivateItem(childRoute, state);
  }

  canLoad(route: Route): boolean {
    // Role
    // if (!this.checkUserRoleForRoute(route)) {
    //   return false;
    // }

    return true;
  }

  private canActivateItem(routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Role
    // if (!this.checkUserRoleForRoute(routeSnapshot.routeConfig)) {
    //   this.modalService.alert('A kért felület megtekintéséhez nincs joga!', 'Figyelmeztetés');
    //   this.router.navigate(['/'], { replaceUrl: true });
    //   return false;
    // }

    return true;
  }

  // private checkUserRoleForRoute(route: Route) {
  //   const allowedRoles = route.data && route.data.allowedRoles && route.data.allowedRoles.length ? route.data.allowedRoles : allRoles();

  //   return this.credentialsService.isAuthenticated() && allowedRoles.indexOf(this.credentialsService.credentials.role) >= 0;
  // }
}
