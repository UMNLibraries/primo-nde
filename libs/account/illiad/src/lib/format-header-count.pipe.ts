import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

@Pipe({
  name: 'formatHeaderCount',
  standalone: true,
})
export class FormatHeaderCountPipe implements PipeTransform {
  transform(list: Array<unknown>): string {
    const count = list.length;
    return count === 0 ? '' : ` (${count})`;
  }
}
