import { AbstractControl, ValidatorFn } from '@angular/forms';

export function emailFormatValidator(): ValidatorFn {

  return (control: AbstractControl): {[key: string]: any} | null => {
	const pattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const match = control.value.length === 0 || pattern.test(control.value.toLowerCase());
    return match ? null : { invalid: true };
  };

}