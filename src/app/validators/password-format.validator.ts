import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordFormatValidator(): ValidatorFn {

  return (control: AbstractControl): {[key: string]: any} | null => {
	const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    const match = control.value.length === 0 || pattern.test(control.value);
    return match ? null : { invalid: true };
  };

}