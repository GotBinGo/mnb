import { Component } from '@angular/core';
import { ThreeView } from './three-view';
import * as THREE from 'three';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-three-head-view',
  templateUrl: './three-view.component.html',
  styleUrls: ['./three-view.component.scss']
})
export class ThreeHeadViewComponent extends ThreeView {
  constructor(public http: HttpClient) {
    super(http);
  }

  afterContentInit() {}
}
