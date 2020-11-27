import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'valueOrType',
})
export class ValueOrTypePipe implements PipeTransform {
  transform(value: unknown, type: any): unknown {
    console.log(type, value);
    return ['object', 'symbol', 'function', 'array'].some(t => t === type) ? type : value;
  }
}
