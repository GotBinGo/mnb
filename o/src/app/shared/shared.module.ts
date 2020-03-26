import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModalComponent } from './modal/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from './modal/confirm-modal/confirm-modal.component';
import { OptionsModalComponent } from './modal/options-modal/options-modal.component';
import { MatDialogModule } from '@angular/material';
import { FormControlErrorComponent } from './form-control-error/form-control-error.component';
import { ThreeHeadViewComponent } from './three-view/three-head-view.component';
import { ThreeFrameViewComponent } from './three-view/three-frame-view.component';
import { SpinnerComponent } from './loading-spinner/spinner/spinner.component';
import { InfotipComponent } from './infotip/infotip.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { IdToArrayItemPipe } from './pipes/id-to-array-item.pipe';

@NgModule({
  declarations: [
    AlertModalComponent,
    ConfirmModalComponent,
    OptionsModalComponent,
    FormControlErrorComponent,
    ThreeHeadViewComponent,
    ThreeFrameViewComponent,
    SpinnerComponent,
    InfotipComponent,
    IdToArrayItemPipe
  ],
  imports: [CommonModule, MatDialogModule, NgbPopoverModule],
  exports: [FormControlErrorComponent, ThreeHeadViewComponent, ThreeFrameViewComponent, InfotipComponent, IdToArrayItemPipe],
  entryComponents: [AlertModalComponent, ConfirmModalComponent, OptionsModalComponent, SpinnerComponent]
})
export class SharedModule {}
