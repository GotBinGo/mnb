import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsService } from '../authentication/credentials.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private credentialsService: CredentialsService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if (this.credentialsService.isAuthenticated()) {
    //   return next.handle(request.clone({ setHeaders: { Authorization: `Bearer ${this.credentialsService.credentials.token}` } }));
    // }
    return next.handle(request.clone({ setHeaders: { 'X-Requested-With': 'XMLHttpRequest' } }));
    // return next.handle(request);
  }
}
