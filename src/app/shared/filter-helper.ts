import { map } from 'rxjs/operators';
import { OperatorFunction } from 'rxjs';

export class FilterHelper {
  static emptyToNull<T>(): OperatorFunction<string | T[], string | T[]> {
    return map((filter: string | T[]) => (!!filter && filter.length !== 0 ? filter : null));
  }
}
