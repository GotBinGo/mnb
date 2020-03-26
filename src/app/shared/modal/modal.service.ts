import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { OptionsModalComponent } from './options-modal/options-modal.component';
import { ImageModalComponent } from './image-modal/image-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  alert = (message: string, title: string = '') => {
    const dialogRef = this.dialog.open(AlertModalComponent, { minWidth: '35vw', maxWidth: '90vw', disableClose: true });
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.title = title;
    return dialogRef;
  };

  confirm = (message: string, title: string = '', options: { primaryActionText?: string; danger?: boolean } = {}) => {
    const dialogRef = this.dialog.open(ConfirmModalComponent, { minWidth: '35vw', maxWidth: '90vw', disableClose: true });
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.options = options;
    return dialogRef;
  };

  options = (message: string, title: string = '', options: { buttonText: string; resultId: number }[]) => {
    const dialogRef = this.dialog.open(OptionsModalComponent, { minWidth: '35vw', maxWidth: '90vw', disableClose: true });
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.options = options;
    return dialogRef;
  };

  image = (image: string, extension: string, title: string = '') => {
    const dialogRef = this.dialog.open(ImageModalComponent, { minWidth: '35vw', maxWidth: '90vw', disableClose: false });
    dialogRef.componentInstance.image = image;
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.extension = extension;
    return dialogRef;
  };
}
