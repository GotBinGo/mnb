import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CredentialsService } from '../authentication/credentials.service';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private router: Router, private credentialsService: CredentialsService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => this.errorHandler(error)));
  }

  private errorHandler(error: HttpEvent<any>): Observable<any> {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        if (this.credentialsService.isKiosk) {
          this.router.navigateByUrl('/kiosk');
        }
      } else if (error.status === 403) {
        this.router.navigateByUrl('/error?code=403');
      }
    }

    return throwError(error);
  }
}
