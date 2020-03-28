import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-map-popup',
  templateUrl: './map-popup.component.html',
  styleUrls: ['./map-popup.component.scss']
})
export class MapPopupComponent implements OnInit {
  @Input() popup: any;

  constructor() {}

  ngOnInit() {}

  close() {
    this.popup.opened = false;
  }
}
