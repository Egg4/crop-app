import { trigger, transition, animate, style } from '@angular/animations';

export const listItemAnimation = trigger('listItemAnimation', [

  transition(':enter', [
    style({
      transform: 'scale(0.9)',
      opacity: 0,
      height: '0px',
    }),
    animate('300ms cubic-bezier(0.8, -0.6, 0.2, 1.5)', style({
      transform: 'scale(1)',
      opacity: 1,
      height: '*',
    }))
  ]),

  transition(':leave', [
    style({
      transform: 'scale(1)',
      opacity: 1,
      height: '*',
    }),
    animate('300ms cubic-bezier(0.8, -0.6, 0.2, 1.5)', style({ 
      transform: 'scale(0.9)',
      opacity: 0, 
      height: '0px',
   }))
  ]),

]);