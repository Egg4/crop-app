import { trigger, transition, animate, style } from '@angular/animations';

export const snackbarAnimation = trigger('snackbarAnimation', [

  transition(':enter', [
    style({
      opacity: 0,
      height: '0px',
    }),
    animate('300ms ease-in-out', style({
      opacity: 1,
      height: '*',
    }))
  ]),

]);