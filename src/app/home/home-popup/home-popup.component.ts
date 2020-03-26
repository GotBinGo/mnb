import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-home-popup',
  templateUrl: './home-popup.component.html',
  styleUrls: ['./home-popup.component.scss']
})
export class HomePopupComponent implements OnInit {
  @Input() popup: any;

  constructor() {}

  ngOnInit() {}

  close() {
    this.popup.opened = false;
  }
}
