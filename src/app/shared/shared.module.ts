import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModalComponent } from './modal/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from './modal/confirm-modal/confirm-modal.component';
import { OptionsModalComponent } from './modal/options-modal/options-modal.component';
import { MatDialogModule } from '@angular/material';
import { FormControlErrorComponent } from './form-control-error/form-control-error.component';
import { ThreeHeadViewComponent } from './three-view/three-view.component';
import { SpinnerComponent } from './loading-spinner/spinner/spinner.component';
import { InfotipComponent } from './infotip/infotip.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { IdToArrayItemPipe } from './pipes/id-to-array-item.pipe';
import { ImageModalComponent } from './modal/image-modal/image-modal.component';
import { DeveloperModalComponent } from './developer-modal/developer-modal.component';

@NgModule({
  declarations: [
    AlertModalComponent,
    ConfirmModalComponent,
    OptionsModalComponent,
    FormControlErrorComponent,
    ThreeHeadViewComponent,
    SpinnerComponent,
    InfotipComponent,
    IdToArrayItemPipe,
    ImageModalComponent,
    DeveloperModalComponent
  ],
  imports: [CommonModule, MatDialogModule, NgbPopoverModule],
  exports: [FormControlErrorComponent, ThreeHeadViewComponent, InfotipComponent, IdToArrayItemPipe],
  entryComponents: [
    AlertModalComponent,
    ConfirmModalComponent,
    OptionsModalComponent,
    SpinnerComponent,
    ImageModalComponent,
    DeveloperModalComponent
  ]
})
export class SharedModule {}
