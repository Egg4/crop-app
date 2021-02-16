import { trigger, transition, query, stagger, animateChild } from '@angular/animations';

export const listAnimation = trigger('listAnimation', [

  transition(':enter', [
    query('@listItemAnimation', stagger('50ms', animateChild()), { optional: true })
  ]),

])