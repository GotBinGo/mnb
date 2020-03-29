import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-radial-progress',
  templateUrl: './radial-progress.component.html',
  styleUrls: ['./radial-progress.component.scss']
})
export class RadialProgressComponent implements OnInit {
  size = 200;
  _progress = 30;
  @Input() set progress(v: number) {
    this._progress = v;
  }
  get progress() {
    return this._progress;
  }
  circ = 52 * 2 * Math.PI;
  get offs() {
    return this.circ - (this.progress / 100) * this.circ;
  }
  @ViewChild('circle', { static: false }) progressEl: ElementRef;

  constructor() {}

  ngOnInit() {}
}
