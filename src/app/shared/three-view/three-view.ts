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
  Output,
  HostListener
} from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Observable, Subscription } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Vector3 } from 'three';
import { getIrodaLabel } from './iroda-labels';
import { youAreHerePoints } from './you-are-here-points';
import { LocationIndicator } from './location-indicator';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { IdleService } from '@app/core/idle.service';

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
  @Input() width = 500;
  @Input() height = 1000;
  @Input() sel: Observable<any>;
  @Input() targyalo: Observable<any>;
  selectedObject: any;

  @Output() selectedRoom = new EventEmitter();

  @ViewChild('mainCanvas', { static: false }) rendererContainer: ElementRef;

  autoRotate = false;
  needRotate = false;

  cameraDefaults = {
    posCamera: new THREE.Vector3(40.0, 25.0, 50.0),
    posCameraTarget: new THREE.Vector3(40, 0, 0),
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
  locationIndicator: LocationIndicator;

  camPosIndex: number = null;
  cameraAnimationTime = 60 * 1.2 /* s */;
  cameraCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(40, 25, 50),
    new THREE.Vector3(40, 75, 0),
    new THREE.Vector3(40, 350, 200),
    new THREE.Vector3(40, 370, 370)
  );

  framerate = 30;
  needRender = true;
  idleSub: Subscription;

  constructor(public http: HttpClient, public credentialsService: CredentialsService, public idleService: IdleService) {
    this.initGL();
  }

  Marker(x: number, z: number) {
    const mk = new THREE.Object3D();
    THREE.Object3D.call(mk);

    const radius = 3.005;
    const sphereRadius = 0.0002;
    const height = 10.05;

    const material = new THREE.MeshPhongMaterial({
      color: 0x12A155
    });
    material.side = THREE.DoubleSide;

    const cone = new THREE.Mesh(new THREE.ConeBufferGeometry(radius, height, 8, 1, true), material);
    cone.position.y = height * 0.5;
    cone.rotation.x = Math.PI;
    cone.position.x = x;
    cone.position.z = z;

    const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(sphereRadius, 16, 8), material);
    sphere.position.y = height * 0.95 + sphereRadius;


    mk.add(cone, sphere);
    return mk;
  }

  // Marker.prototype = Object.create(THREE.Object3D.prototype);

  onInputChanges(changes: SimpleChanges) {}

  ngOnInit() {
    // this.scene.background = new THREE.Color( 0xeeeeee );

    new THREE.FontLoader().load('/assets/fonts/roboto_regular.typeface.json', font => {
      this.font = font;
      this.http
        // .request('get', '/assets/models/iroda-alap.obj', {
        .request('get', '/assets/models/posta-alap.obj', {
          observe: 'response',
          responseType: 'blob'
        })
        .pipe(map(x => x.body))
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(obj => this.initContent(obj, 'ALAP'));
      this.http
        // .request('get', '/assets/models/iroda.obj', {
        .request('get', '/assets/models/posta-rooms.obj', {
          observe: 'response',
          responseType: 'blob'
        })
        .pipe(map(x => x.body))
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(obj => this.initContent(obj, 'IRODAK'));

      // this.http
        // // .request('get', '/assets/models/iroda-falak.txt', {
        // .request('get', '/assets/models/posta-rooms.obj', {
        //   observe: 'response',
        //   responseType: 'blob'
        // })
        // .pipe(map(x => x.body))
        // .pipe(finalize(() => (this.isLoading = false)))
        // .subscribe(obj => this.initContent(obj, 'FALAK'));
    });

    this.addLocationIndicator();

    // setTimeout(() => (this.camPosIndex = 0), 1000);
    this.camPosIndex = 0;

    this.idleSub = this.idleService.getIdleStateSubject().subscribe(inIdle => {
      if (inIdle) {
        this.recenter();
        // setTimeout(() => {this.needRender = false; }, 3000);
      } else {
        this.needRender = true;
      }
    });
  }

  @HostListener('mousemove', ['$event'])
  @HostListener('touchstart', ['$event'])
  onDocumentMouseMove = (event: any) => {
    // event.preventDefault();
    const x = event.clientX || (event.touches && event.touches.length && event.touches[0].clientX) || 0;
    const y = event.clientY || (event.touches && event.touches.length && event.touches[0].clientY) || 0;
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

  @HostListener('click', ['$event'])
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
    this.scene.background = new THREE.Color( 0xfafafa );
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.screenSpacePanning = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 50;
    this.controls.maxDistance = 800;
    this.controls.autoRotate = this.autoRotate;
    // this.controls.enablePan = false;
    this.controls.enableKeys = false;
    this.controls.target.set( 40, 0, 25);
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

    this.idleSub.unsubscribe();
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

  addLocationIndicator() {
    if (this.credentialsService.isKiosk) {
      const indicator = new LocationIndicator(youAreHerePoints[this.credentialsService.kioskId] || youAreHerePoints['1']);
      this.objects.push(indicator);
      this.scene.add(indicator);
      this.locationIndicator = indicator;
    }
  }

  initContent(obj: Blob, name: string) {
    const objLoader = new OBJLoader();
    objLoader.load(URL.createObjectURL(obj), o => {
      o.name = name;
      const maxXYZ = 4.3;
      o.scale.multiplyScalar(250 / maxXYZ);
      if (name === 'FALAK') {
        (o.children[0] as any).material = new THREE.MeshBasicMaterial({ color: '#23235d' });
      }
      if (name === 'IRODAK') {
        o.position.y = 0.2;

        const labels = new THREE.Group();
        labels.name = 'LABELS';
        for (const oo of o.children) {
          const iroda = oo as THREE.Mesh;
          const labelText = getIrodaLabel(iroda.name.split('_')[0]);
          iroda.material = new THREE.MeshLambertMaterial({ color: '#ffffff', opacity: 0.2, transparent: true });
          iroda.position.set(iroda.position.x, iroda.position.y + 0.01, iroda.position.z);
          // const geometry = new THREE.TextBufferGeometry(labelText, {
          //   font: this.font,
          //   size: 3,
          //   height: 0.1,
          //   curveSegments: 2
          // });
          // // const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0x33335d }));
          // const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xffffff }));
          // (object.material as any).emissive.setHex(0xffffff);
          // object.name = labelText;
          // object.rotateX(-Math.PI / 2);
          // object.rotateZ(Math.PI / 8);
          // iroda.geometry.computeBoundingBox();
          // geometry.computeBoundingBox();
          // const oCenter = iroda.geometry.boundingBox.getCenter(iroda.position.clone()).multiplyScalar(250 / maxXYZ);
          // const centerOffset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
          // // const centerOffsetZ = -0.5 * (geometry.boundingBox.max.z - geometry.boundingBox.min.z);
          // object.position.set(oCenter.x + centerOffset, oCenter.y + 1, oCenter.z + 5);
          // labels.add(object);
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
          // console.log('sel sub', x);
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
        (o.children[0] as any).material = new THREE.MeshPhysicalMaterial({ color: '#aaa' });
      }
      this.objects.push(o);
      this.scene.add(o);
      // this.scene.add(this.Marker(0, 0));



      this.scene.add(this.Marker(-55, -50));
      this.scene.add(this.Marker(-45, -70));
      this.scene.add(this.Marker(-55, -0));
      this.scene.add(this.Marker(-15, 30));

      this.scene.add(this.Marker(-45, 80));

      this.scene.add(this.Marker(50, 52));
    });
  }
  intersect() {
    if (!this.scene) {
      // TODO #tempfix ide eljut akkor is, mikor nem a mapon vagyunk. ez csak helyi kezelés
      return;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      if (this.INTERSECTED !== intersects[0].object && intersects[0].object.parent && intersects[0].object.parent.name === 'IRODAK') {
        if (this.INTERSECTED) {
          this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
        }
        this.INTERSECTED = intersects[0].object;

        this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
        this.INTERSECTED.material.emissive.setHex(0xffd382);
      }
    } else {
      if (this.INTERSECTED) {
        this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
      }
      this.INTERSECTED = null;
    }

    if (this.selectedObject) {
      if (this.selectedObject.material.color.r === 1) {
        this.selectedObject.material.emissive.setHex(0xff0000);
      } else if (this.selectedObject.material.color.g === 1) {
        this.selectedObject.material.emissive.setHex(0x00ff00);
      } else {
        this.selectedObject.material.emissive.setHex(0xffa600);
      }
    }
  }

  animate() {
    if (this.renderer && this.needRender) {
      if (this.camPosIndex != null && this.camPosIndex++ < this.cameraAnimationTime) {
        const camPos = this.cameraCurve.getPoint(1 - (1 - this.camPosIndex / this.cameraAnimationTime) ** 2);
        this.camera.position.set(camPos.x, camPos.y, camPos.z);
      }
      this.locationIndicator && this.locationIndicator.update(+new Date());
      this.controls.update();
      this.intersect();
      this.renderer.render(this.scene, this.camera);
    }
    window.requestAnimationFrame(() => this.animate());
  }

  recenter() {
    // const camDiff = Math.abs(this.camera.position.x) + Math.abs(this.camera.position.y - 175) + Math.abs(this.camera.position.z - 200);

    // if (camDiff > 1) {
    //   this.cameraCurve = new THREE.CubicBezierCurve3(
    //     new THREE.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z),
    //     new THREE.Vector3(0, 75, 0),
    //     new THREE.Vector3(0, 200, 100),
    //     new THREE.Vector3(0, 175, 200)
    //   );

    //   this.camPosIndex = 0;
    // }
  }
}
