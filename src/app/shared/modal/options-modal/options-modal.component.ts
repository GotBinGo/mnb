import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-options-modal',
  templateUrl: './options-modal.component.html',
  styleUrls: ['./options-modal.component.scss']
})
export class OptionsModalComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;
  @Input() options: { buttonText: string; resultId: number }[];

  constructor(private dialogRef: MatDialogRef<OptionsModalComponent>) {}

  ngOnInit() {}

  optionClicked(id: number) {
    this.dialogRef.close(id);
  }
}
