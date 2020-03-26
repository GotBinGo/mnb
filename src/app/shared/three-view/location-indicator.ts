import * as THREE from 'three';

export class LocationIndicator extends THREE.Mesh {
  basePosition: THREE.Vector3;

  constructor(position: { x: number; y: number }) {
    const geometry = new THREE.ConeGeometry(5, 8, 6);
    geometry.rotateX(Math.PI);
    const material = new THREE.MeshPhongMaterial({ color: 0x00c3f2 });
    super(geometry, material);
    this.basePosition = new THREE.Vector3(position.x, 10, position.y);
    this.position.copy(this.basePosition);
  }

  update(time: number) {
    this.position.copy(this.basePosition.clone().add(new THREE.Vector3(0, 2 * Math.sin(time / 200), 0)));
  }
}
