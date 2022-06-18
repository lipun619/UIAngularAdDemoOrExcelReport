import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameCutter'
})
export class NameCutterPipe implements PipeTransform {

  transform(value: any): any {
    if (value) {
      return value.substring(0, value.indexOf('#'));
    }
  }
}
