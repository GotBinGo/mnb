import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;

  constructor(private dialogRef: MatDialogRef<AlertModalComponent>) {}

  ngOnInit() {}

  close = () => {
    this.dialogRef.close();
  };
}
