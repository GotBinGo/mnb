import { Component, SimpleChanges, Input } from '@angular/core';
import { ThreeView } from './three-view';
import * as THREE from 'three';
import { HttpClient } from '@angular/common/http';

const getChildByName = (object: THREE.Object3D, name: string) => {
  let o = object.getObjectByName(name);
  if (o != null) {
    return o;
  }
  // fallback - contains
  o = object.children.filter(x => x.name.indexOf(name) >= 0)[0];
  return o || null;
};

@Component({
  selector: 'app-three-frame-view',
  templateUrl: './three-view.component.html',
  styleUrls: ['./three-view.component.scss']
})
export class ThreeFrameViewComponent extends ThreeView {
  @Input() centerColor: string;
  @Input() rightColor: string;
  @Input() leftColor: string;

  autoRotate = true;
  needRotate = true;

  constructor(public http: HttpClient) {
    super(http);
  }

  onInputChanges(changes: SimpleChanges): void {
    this.updateColors();
  }

  afterContentInit() {
    this.updateColors();
  }

  updateColors() {
    if (this.object) {
      const centerColor = new THREE.Color(this.centerColor || 'white');
      const rightColor = new THREE.Color(this.rightColor || this.centerColor || 'white');
      const leftColor = new THREE.Color(this.leftColor || this.centerColor || 'white');

      const centerMesh = getChildByName(this.object, 'FrameFront') as THREE.Mesh;
      const rightMesh = getChildByName(this.object, 'TempleR') as THREE.Mesh;
      const leftMesh = getChildByName(this.object, 'TempleL') as THREE.Mesh;

      if (centerMesh) {
        centerMesh.material = new THREE.MeshPhysicalMaterial({ color: centerColor });
      }
      if (rightMesh) {
        rightMesh.material = new THREE.MeshPhysicalMaterial({ color: rightColor });
      }
      if (leftMesh) {
        leftMesh.material = new THREE.MeshPhysicalMaterial({ color: leftColor });
      }
    }
  }
}
