import { FormGroup, AbstractControl } from '@angular/forms';
import { ErrorDto } from '@app/core/models/error';
import { lowerFirst } from 'lodash';

export class FormHelper {
  static processServerErrors(form: FormGroup, error: ErrorDto) {
    Object.keys(error.validationErrors || {}).forEach(errorKey => {
      const controlKey = lowerFirst(errorKey);
      const control = form.get(controlKey);
      if (control != null) {
        const serverErrors =
          error.validationErrors[errorKey] && error.validationErrors[errorKey].length ? error.validationErrors[errorKey] : null;
        control.markAsTouched();
        if (serverErrors) {
          control.setErrors(Object.assign({}, control.errors, { serverErrors }));
        }
      }
    });
  }

  static addServerErrorsToControl(control: AbstractControl, serverErrors: string[]) {
    if (serverErrors) {
      control.markAsTouched();
      control.setErrors(Object.assign({}, control.errors, { serverErrors }));
    }
  }
}
