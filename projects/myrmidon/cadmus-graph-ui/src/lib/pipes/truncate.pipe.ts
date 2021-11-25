import { Pipe, PipeTransform } from '@angular/core';

/**
 * A simple truncate pipe. Usage sample: ... | truncate:10:'...'.
 */
@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(
    text: string | undefined | null,
    length: number = 50,
    suffix: string = '...'
  ): string | undefined | null {
    if (!text) {
      return text;
    }
    if (text?.length > length) {
      let truncated: string = text.substring(0, length).trim() + suffix;
      return truncated;
    }
    return text;
  }
}
