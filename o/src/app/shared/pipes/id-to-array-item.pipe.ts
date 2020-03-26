import { Pipe, PipeTransform } from '@angular/core';
import { find } from 'lodash';

@Pipe({ name: 'idToArrayItem' })
export class IdToArrayItemPipe implements PipeTransform {
  transform(value: number, array: any[], idField: string, valueField: string) {
    const item = find(array, (i: any) => i[idField] === value);
    return item ? item[valueField] : '';
  }
}
