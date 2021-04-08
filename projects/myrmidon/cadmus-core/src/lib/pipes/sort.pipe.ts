import { Pipe, PipeTransform } from '@angular/core';

/**
 * Sort pipe. Use like *ngFor="let i of items | sort:'propname'".
 */
@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(value: any[], propName: string): unknown {
    return value.sort((a, b) => {
      if (a[propName] < b[propName]) {
        return -1;
      } else if (a[propName] === b[propName]) {
        return 0;
      } else if (a[propName] > b[propName]) {
        return 1;
      }
    });
  }
}
