import { Component, OnInit, Input } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ModalService } from '@app/shared/modal/modal.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-cropimage-modal',
  templateUrl: './cropimage-modal.component.html',
  styleUrls: ['./cropimage-modal.component.scss']
})
export class CropimageModalComponent implements OnInit {
  @Input() imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(private dialogRef: MatDialogRef<CropimageModalComponent>, private modalService: ModalService) {}

  ngOnInit() {}

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  async loadImageFailed() {
    await this.modalService
      .alert('Hiba történt a kép betöltése közben!', 'Hiba')
      .afterClosed()
      .toPromise();
    this.dialogRef.close();
  }

  close(success: boolean) {
    if (success) {
      this.dialogRef.close(this.croppedImage);
      return;
    }

    this.dialogRef.close();
  }
}
