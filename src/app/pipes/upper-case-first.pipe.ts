import { Pipe, PipeTransform } from '@angular/core';
/*
 * Capitalize the first letter of the string
 * Takes a string as a value.
 * Usage:
 *   value | uppercasefirst
 * Example:
 *   {{ 'use case' | uppercasefirst }}
 *   formats to: 'Use case'
*/
@Pipe({
  name: 'uppercaseFirst'
})
export class UpperCaseFirstPipe implements PipeTransform {

  transform(value: string): string {
    if (!value.length) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

}