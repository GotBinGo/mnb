import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, CanActivateChild } from '@angular/router';

import { CredentialsService } from './credentials.service';

@Injectable()
export class NoAuthenticationGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private router: Router, private credentialsService: CredentialsService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivateItem(route, state);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivateItem(childRoute, state);
  }

  canLoad(route: Route): boolean {
    // Auth
    if (this.credentialsService.isAuthenticated()) {
      this.router.navigateByUrl('/');
      return false;
    }

    return true;
  }

  private canActivateItem(routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Auth
    if (this.credentialsService.isAuthenticated()) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
