import { Injectable, OnDestroy } from '@angular/core';
import { OverlayRef, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SpinnerComponent } from './spinner/spinner.component';
import { Subject, interval } from 'rxjs';
import { scan, delayWhen } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService implements OnDestroy {
  private overlayRef: OverlayRef;
  private spinnerComponent: ComponentPortal<SpinnerComponent>;

  private reqCount = 0;

  constructor(private overlay: Overlay) {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      scrollStrategy: this.overlay.scrollStrategies.block(),
      hasBackdrop: true,
      backdropClass: 'loader-backdrop',
      positionStrategy
    });

    this.overlayRef = this.overlay.create(overlayConfig);
    this.spinnerComponent = new ComponentPortal(SpinnerComponent);
  }

  public show(): void {
    this.reqCount++;
    if (this.reqCount === 1) {
      this.overlayRef.attach(this.spinnerComponent);
    }
  }

  public hide(): void {
    if (this.reqCount > 0) {
      this.reqCount--;
    }
    if (this.reqCount === 0) {
      this.overlayRef.detach();
    }
  }

  ngOnDestroy(): void {
    this.overlayRef.dispose();
  }
}
