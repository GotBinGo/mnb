import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss']
})
export class ImageModalComponent implements OnInit {
  @Input() image: string;
  @Input() extension: string;
  @Input() title: string;
  constructor(private dialogRef: MatDialogRef<ImageModalComponent>) {}

  ngOnInit() {}

  close = () => {
    this.dialogRef.close();
  };
}
