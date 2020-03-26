import {
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  EventEmitter,
  Output
} from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Observable, Subscription } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Vector3 } from 'three';
import { getIrodaLabel } from './iroda-labels';

const getChildByName = (object: THREE.Object3D, name: string) => {
  let o = object.getObjectByName(name);
  if (o != null) {
    return o;
  }
  // fallback - contains
  o = object.children.filter(x => x.name.indexOf(name) >= 0)[0];
  return o || null;
};

export abstract class ThreeView implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() objModel: Observable<Blob>;
  @Input() objModel2: Observable<Blob>;
  @Input() width = 1920;
  @Input() height = 1080;
  @Input() sel: Observable<any>;
  @Input() targyalo: Observable<any>;
  selectedObject: any;

  @Output() selectedRoom = new EventEmitter();

  @ViewChild('mainCanvas', { static: false }) rendererContainer: ElementRef;

  autoRotate = false;
  needRotate = false;

  cameraDefaults = {
    posCamera: new THREE.Vector3(0.0, 25.0, 0.0),
    posCameraTarget: new THREE.Vector3(0, 0, 0),
    near: 0.1,
    far: 10000,
    fov: 45,
    aspectRatio: this.width / this.height
  };

  renderer: THREE.Renderer = null;
  scene: THREE.Scene = null;
  camera: THREE.PerspectiveCamera = null;
  object: THREE.Group = null;

  controls: OrbitControls = null;

  isLoading = true;

  lastModelSubscription: Subscription;

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  INTERSECTED: any;
  lastTouch: any;
  time: any = null;
  texts: any = [];
  objects: any = [];
  tt: any = false;
  font: THREE.Font;

  camanimationended = false;
  lastFrame: any = null;

  constructor(public http: HttpClient) {
    this.initGL();
  }

  onInputChanges(changes: SimpleChanges) {}

  ngOnInit() {
    document.addEventListener('mousemove', this.onDocumentMouseMove, false);
    document.addEventListener('touchstart', this.onDocumentMouseMove, false);
    document.addEventListener('click', this.onDocumentMouseClick, false);

    new THREE.FontLoader().load('/assets/fonts/helvetiker_regular.typeface.json', font => {
      this.font = font;
      this.http
        .request('get', '/assets/models/iroda-alap.txt', {
          observe: 'response',
          responseType: 'blob'
        })
        .pipe(map(x => x.body))
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(obj => this.initContent(obj, 'ALAP'));
      this.http
        .request('get', '/assets/models/iroda.txt', {
          observe: 'response',
          responseType: 'blob'
        })
        .pipe(map(x => x.body))
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(obj => this.initContent(obj, 'IRODAK'));

      this.http
        .request('get', '/assets/models/iroda-falak.txt', {
          observe: 'response',
          responseType: 'blob'
        })
        .pipe(map(x => x.body))
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(obj => this.initContent(obj, 'FALAK'));
    });
  }

  onDocumentMouseMove = (event: any) => {
    // event.preventDefault();
    const x = event.clientX || event.touches[0].clientX;
    const y = event.clientY || event.touches[0].clientY;
    const rect = this.rendererContainer.nativeElement.getBoundingClientRect();
    this.mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((y - rect.top) / rect.height) * 2 + 1;
    if (event.touches) {
      this.intersect();
      if (this.INTERSECTED) {
        this.selectedRoom.emit(this.INTERSECTED.name.split('_')[0]);
      }
    }
  };

  onDocumentMouseClick = (event: any) => {
    if (this.INTERSECTED) {
      this.selectedRoom.emit(this.INTERSECTED.name.split('_')[0]);
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    this.onInputChanges(changes);
  }

  ngAfterViewInit() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.rendererContainer.nativeElement, antialias: true, alpha: true });
    this.renderer.setSize(this.width, this.height, false);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.screenSpacePanning = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 25;
    this.controls.maxDistance = 400;
    this.controls.autoRotate = this.autoRotate;

    this.controls.minPolarAngle = 0.0 * Math.PI;
    this.controls.maxPolarAngle = 0.4 * Math.PI;
    this.controls.minAzimuthAngle = -0.25 * Math.PI;
    this.controls.maxAzimuthAngle = 0.25 * Math.PI;
    this.animate();
  }

  ngOnDestroy() {
    if (this.scene) {
      this.scene.dispose();
    }
    if (this.controls) {
      this.controls.dispose();
    }
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.object = null;
    this.controls = null;
  }

  initGL() {
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0xaaaaaa));
    const light1 = new THREE.PointLight(0xc0c090, 0.25);
    const light2 = new THREE.PointLight(0xc0c090, 0.25);
    const light3 = new THREE.PointLight(0xc0c090, 0.25);
    const light4 = new THREE.PointLight(0xc0c090, 0.25);
    light1.position.set(-300, 100, -300);
    light2.position.set(300, 100, -300);
    light3.position.set(-300, -100, 300);
    light4.position.set(300, -100, 300);
    this.scene.add(light1);
    this.scene.add(light2);
    this.scene.add(light3);
    this.scene.add(light4);

    this.camera = new THREE.PerspectiveCamera(
      this.cameraDefaults.fov,
      this.cameraDefaults.aspectRatio,
      this.cameraDefaults.near,
      this.cameraDefaults.far
    );
    this.camera.position.copy(this.cameraDefaults.posCamera);
    this.camera.lookAt(this.cameraDefaults.posCameraTarget);
    this.camera.updateProjectionMatrix();
  }

  initContent(obj: Blob, name: string) {
    const objLoader = new OBJLoader();
    objLoader.load(URL.createObjectURL(obj), o => {
      o.name = name;
      const maxXYZ = 4.3;
      o.scale.multiplyScalar(250 / maxXYZ);
      if (name === 'FALAK') {
        (o.children[0] as any).material = new THREE.MeshPhysicalMaterial({ color: '#ff0000' });
      }
      if (name === 'IRODAK') {
        o.position.y = 0.2;

        const labels = new THREE.Group();
        labels.name = 'LABELS';
        for (const oo of o.children) {
          const iroda = oo as THREE.Mesh;
          const labelText = getIrodaLabel(iroda.name.split('_')[0]);
          iroda.material = new THREE.MeshPhysicalMaterial({ color: '#110000', opacity: 0.3, transparent: true });
          const geometry = new THREE.TextBufferGeometry(labelText, {
            font: this.font,
            size: 3,
            height: 0.1,
            curveSegments: 2
          });
          // const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0x7d0a27 }));
          const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xffffff }));
          (object.material as any).emissive.setHex(0xffffff);
          object.name = labelText;
          object.rotateX(-Math.PI / 2);
          object.rotateZ(Math.PI / 8);
          iroda.geometry.computeBoundingBox();
          geometry.computeBoundingBox();
          const oCenter = iroda.geometry.boundingBox.getCenter(iroda.position.clone()).multiplyScalar(250 / maxXYZ);
          const centerOffset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
          // const centerOffsetZ = -0.5 * (geometry.boundingBox.max.z - geometry.boundingBox.min.z);
          object.position.set(oCenter.x + centerOffset, oCenter.y + 1, oCenter.z + 5);
          labels.add(object);
        }
        this.scene.add(labels);
        this.targyalo.subscribe(x => {
          const irodak = o;
          if (irodak) {
            const targetIroda = getChildByName(irodak, x.id);
            (targetIroda as any).material.opacity = 0.5;
            if (x.free) {
              (targetIroda as any).material.color.setHex(0x00ff00);
            } else {
              (targetIroda as any).material.color.setHex(0xff0000);
            }
          }
        });
        this.sel.subscribe(x => {
          console.log('sel sub', x);
          const irodak = o;
          if (irodak) {
            const targetIroda = getChildByName(irodak, x);
            if (this.selectedObject) {
              this.selectedObject.material.emissive.setHex(0x000000);
            }
            this.selectedObject = targetIroda;
          }
        });
      }
      if (name === 'ALAP') {
        (o.children[0] as any).material = new THREE.MeshPhysicalMaterial({ color: '#ffe5c2' });
      }
      this.objects.push(o);
      this.scene.add(o);
    });
  }
  intersect() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      if (this.INTERSECTED !== intersects[0].object && intersects[0].object.parent && intersects[0].object.parent.name === 'IRODAK') {
        if (this.INTERSECTED) {
          this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
        }
        this.INTERSECTED = intersects[0].object;

        this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
        this.INTERSECTED.material.emissive.setHex(0xff0000);
      }
    } else {
      if (this.INTERSECTED) {
        this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
      }
      this.INTERSECTED = null;
    }

    if (this.selectedObject) {
      this.selectedObject.material.emissive.setHex(0x00ff00);
    }
  }

  animate() {
    const curr = +new Date();
    if (!this.lastFrame) {
      this.lastFrame = curr;
      this.time = curr;
    }
    const delta = (curr - this.lastFrame) / 17;
    this.lastFrame = curr;
    if (this.renderer) {
      window.requestAnimationFrame(() => this.animate());
      if (!this.camanimationended) {
        if (curr - this.time > 200) {
          this.camera.position.add(
            new THREE.Vector3(0, 1.8 * delta, 1.8 * delta).multiplyScalar(350000 / (curr - this.time) / (curr - this.time))
          );
        }
        // console.log('anim');
        if (this.camera.position.z >= 200) {
          this.camanimationended = true;
          // console.log('anim done');
        }
      }
      this.controls.update();
      this.intersect();
      this.renderer.render(this.scene, this.camera);
    }
  }
}
