import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from '@app/shared/loading-spinner/spinner.service';
import { ExtraHttpParams } from '@app/api/app.generated';

@Injectable()
export class ParameterExtrasInterceptor implements HttpInterceptor {
  constructor(private spinnerService: SpinnerService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const extras: any = (request.params as ExtraHttpParams).extras || {};
    extras.loading && this.spinnerService.show();
    return next.handle(request).pipe(finalize(() => extras.loading && this.spinnerService.hide()));
  }
}
