import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { ModalService } from '@app/shared/modal/modal.service';
import { IDeactivateConfirm } from './deactivate-confirm';

@Injectable()
export class DeactivateConfirmGuard implements CanDeactivate<IDeactivateConfirm> {
  constructor(private router: Router, private modalService: ModalService) {}

  async canDeactivate(
    component: IDeactivateConfirm,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Promise<boolean> {
    const needConfirm = component.hasUnsavedData ? component.hasUnsavedData() : true;
    if (needConfirm) {
      const result = await this.modalService
        .confirm('Biztosan elnavigál az oldalról?', 'Figyelmeztetés')
        .afterClosed()
        .toPromise();
      return result || false;
    }
    return true;
  }
}
