import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { environment } from '@env/environment';
import { ApiException } from '../../api/app.generated';
import { ErrorHelper } from '../../shared/error-helper';
import { ModalService } from '../../shared/modal/modal.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private modalService: ModalService, private ngZone: NgZone) {}

  handleError(error: Error) {
    // API hívások során keletkező hiba
    if (error instanceof ApiException) {
      // ilyenkor nincsen custom error modell a válaszban, interceptor ezt az ágat lekezeli
      if (error.status === 401 || error.status === 403) {
        return;
      }
      // 429 - too many request. aspnet rate limiting
      if (error.status === 429) {
        this.ngZone.run(() => this.modalService.alert('Túl gyakran próbálkozik a művelet végrehajtásával.', 'Hiba'));
        return;
      }

      const dto = ErrorHelper.apiExceptionToErrorDto(error);
      if (error.status >= 400 && error.status < 500) {
        this.ngZone.run(() => this.modalService.alert(dto.message, dto.title || 'Hiba'));
      } else if (error.status >= 500) {
        this.ngZone.run(() => this.modalService.alert(dto.message, dto.title || 'Szerveroldali hiba'));
      }
    } else if (!environment.production) {
      console.error(error);
    }
  }
}
