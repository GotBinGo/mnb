import { NgModule, Optional, SkipSelf, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CredentialsService } from './authentication/credentials.service';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorComponent } from './error/error.component';
import { ErrorHandlerInterceptor } from './interceptors/error-handler.interceptor';
import { GlobalErrorHandler } from './interceptors/global-error-handler';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import {
  MatNativeDateModule,
  MAT_DATE_LOCALE,
  MatPaginatorIntl,
  MatTooltipDefaultOptions,
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  DateAdapter,
  MatDatepickerModule
} from '@angular/material';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from '../shared/shared.module';
import { RoleGuard } from './authentication/role.guard';
import { LocaleDateAdapter } from './locale-date-adapter';
import { DeactivateConfirmGuard } from './deactivate/deactivate-confirm.guard';
import { NgSelectConfig } from '@ng-select/ng-select';
import { NoAuthenticationGuard } from './authentication/no-authentication.guard';
import { ParameterExtrasInterceptor } from './interceptors/parameter-extras.interceptor';
import { KioskComponent } from './kiosk/kiosk.component';

const getCustomMatPaginatorIntl = () => {
  const ret = new MatPaginatorIntl();
  ret.itemsPerPageLabel = 'Elemek száma egy oldalon:';
  ret.previousPageLabel = 'Előző oldal';
  ret.nextPageLabel = 'Következő oldal';
  ret.firstPageLabel = 'Első oldal';
  ret.lastPageLabel = 'Utolsó oldal';
  ret.getRangeLabel = (page: number, size: number, length: number) =>
    `${page + 1}. oldal, ${page * size + 1} - ${Math.min((page + 1) * size, length)} elemek (összesen: ${length})`;
  return ret;
};

const customTooltipDefaults: MatTooltipDefaultOptions = {
  position: 'above',
  hideDelay: 0,
  showDelay: 0,
  touchendHideDelay: 0
};

const ngSelectDefaults = {
  clearAllText: 'Törlés',
  notFoundText: 'Nincs megjeleníthető elem',
  loadingText: 'Betöltés...',
  placeholder: 'Válasszon!'
};

@NgModule({
  declarations: [LoginComponent, ErrorComponent, KioskComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    RouterModule,
    ToastrModule.forRoot(),
    MatNativeDateModule,
    SharedModule
  ],
  providers: [
    CredentialsService,
    AuthenticationGuard,
    NoAuthenticationGuard,
    RoleGuard,
    DeactivateConfirmGuard,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ParameterExtrasInterceptor,
      multi: true
    },
    MatNativeDateModule, // Global provide
    { provide: MAT_DATE_LOCALE, useValue: 'hu-HU' },
    { provide: DateAdapter, useClass: LocaleDateAdapter },
    { provide: MatPaginatorIntl, useValue: getCustomMatPaginatorIntl() },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: customTooltipDefaults },
    { provide: NgSelectConfig, useValue: ngSelectDefaults }
  ],
  exports: [LoginComponent, ErrorComponent, KioskComponent]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // Import guard
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
    }
  }
}
