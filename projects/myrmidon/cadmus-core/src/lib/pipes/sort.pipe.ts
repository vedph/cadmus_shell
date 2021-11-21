import { Pipe, PipeTransform } from '@angular/core';

/**
 * Sort pipe. Use like *ngFor="let i of items | sort:'propname'".
 */
@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(value: any[], propName: string): unknown {
    if (!value || !Array.isArray(value)) {
      return value;
    }
    return [...value].sort((a, b) => {
      if (!a && !b) {
        return 0;
      }
      if (!a && b) {
        return -1;
      }
      if (a && !b) {
        return 1;
      }
      if (a[propName] < b[propName]) {
        return -1;
      } else if (a[propName] === b[propName]) {
        return 0;
      } else if (a[propName] > b[propName]) {
        return 1;
      }
      return 0;
    });
  }
}
