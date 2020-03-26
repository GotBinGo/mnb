import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;
  @Input() options: { primaryActionText?: string; danger?: boolean } = {};

  constructor(private dialogRef: MatDialogRef<ConfirmModalComponent>) {}

  ngOnInit() {}

  close = (res: boolean) => {
    this.dialogRef.close(res);
  };
}
