import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textTransform',
})
export class TextTransformPipe implements PipeTransform {
  transform(value: string, format?: string): string {
    if (!value) {
      return '';
    }
    if (format === 'lowercase') {
      return value.toLowerCase();
    }
    if (format === 'pascalcase') {
      value = value.toLowerCase().replace(/_/g, ' ');
      return value[0].toUpperCase() + value.slice(1);
    }
    if (format === 'camelcase') {
      return value.slice(0, value.length - 1) + value[value.length - 1].toUpperCase();
    }
    if (format === 'formatText') {
      return value
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }
    return value.toUpperCase();
  }
}
