import { Component } from '@angular/core';
import { ThreeView } from './three-view';
import * as THREE from 'three';
import { HttpClient } from '@angular/common/http';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { IdleService } from '@app/core/idle.service';

@Component({
  selector: 'app-three-view',
  templateUrl: './three-view.component.html',
  styleUrls: ['./three-view.component.scss']
})
export class ThreeHeadViewComponent extends ThreeView {
  constructor(public http: HttpClient, public credentialsService: CredentialsService, public idleService: IdleService) {
    super(http, credentialsService, idleService);
  }

  afterContentInit() {}
}
