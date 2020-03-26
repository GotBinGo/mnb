import { Component, OnInit } from '@angular/core';
import { dummyProfile } from '@app/shared/dummy-profile-image';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  dummyProfile = dummyProfile;
  sidenav = { opened: false };
  constructor() {}

  ngOnInit() {}
}
