import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { HrRoutingModule } from './hr-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material';
import { SharedModule } from '@app/shared/shared.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CropimageModalComponent } from './newsletter/cropimage-modal/cropimage-modal.component';

@NgModule({
  declarations: [NewsletterComponent, CropimageModalComponent],
  imports: [CommonModule, HrRoutingModule, ReactiveFormsModule, MatTooltipModule, SharedModule, ImageCropperModule],
  entryComponents: [CropimageModalComponent]
})
export class HrModule {}
