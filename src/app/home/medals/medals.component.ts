import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-medals',
  templateUrl: './medals.component.html',
  styleUrls: ['./medals.component.scss']
})
export class MedalsComponent implements OnInit, AfterViewInit {
  progresses = {
    barter: 0,
    shell: 0,
    coin: 0,
    paper: 0,
    plastic: 0,
    crypto: 0
  };

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.progresses = {
        barter: 37,
        shell: 52,
        coin: 73,
        paper: 100,
        plastic: 32,
        crypto: 12
      };
    }, 1000);
  }
}
