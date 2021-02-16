import { Injectable } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { CropStore } from '../stores/crop-store.service';

@Injectable({
  providedIn: 'root'
})
export class CropUnicityValidator implements AsyncValidator {

  constructor(
    private cropStore: CropStore
  ) { }

  public validate(form: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
	if (!form.dirty
	|| form.get('plant_ids').invalid
	|| form.get('number').invalid) {
      return of(null);
	}

    return this.cropStore.exists(form.value).pipe(
      map(crop => {
	    const errors = crop && crop.id !== form.get('id').value ? { exists: true } : null;
	    return errors;
      }),
    );
  }

}