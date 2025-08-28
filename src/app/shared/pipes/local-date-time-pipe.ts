import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localDateTime'
})
export class LocalDateTimePipe implements PipeTransform {

  transform(date: Date): string {
    const localDate = new Date(date)
    return localDate.toLocaleString();
  }

}
