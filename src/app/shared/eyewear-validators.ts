import { FormGroup } from '@angular/forms';

export class EyeWearValidators {
  static get allOrNone() {
    return (group: FormGroup) => {
      const values = Object.keys(group.controls).map(key => group.controls[key].value);
      if (values.every(x => !!x) || values.every(x => !x)) {
        return null;
      } else {
        return { allOrNone: true };
      }
    };
  }
}
