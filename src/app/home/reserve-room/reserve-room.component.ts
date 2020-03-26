import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-reserve-room',
  templateUrl: './reserve-room.component.html',
  styleUrls: ['./reserve-room.component.scss']
})
export class ReserveRoomComponent implements OnInit {
  @Input() title: string;

  hours = [...Array(24).keys()];
  minutes = [...Array(60).keys()];
  intervals = [
    { value: 5, label: '5 Perc' },
    { value: 15, label: '15 Perc' },
    { value: 30, label: '30 Perc' },
    { value: 45, label: '45 Perc' },
    { value: 60, label: '1 óra' },
    { value: 90, label: '1.5 óra' },
    { value: 120, label: '2 óra' },
    { value: 150, label: '2.5 óra' },
    { value: 180, label: '3 óra' },
    { value: 240, label: '4 óra' }
  ];

  date: Date = new Date();
  hour = this.date.getHours();
  minute = this.date.getMinutes();

  interval = 30;

  addTagFn(label: string) {
    return { value: +label, label: label + ' perc' };
  }

  constructor(private dialogRef: MatDialogRef<ReserveRoomComponent>) {}

  ngOnInit() {}

  close = () => {
    this.dialogRef.close();
  };

  ok = () => {
    const startDate = new Date(this.date);
    startDate.setHours(this.hour);
    startDate.setMinutes(this.minute);
    const interval = +this.interval || 30;
    this.dialogRef.close({ startDate, interval });
  };
}
