import { trigger, transition, group, query, animate, style } from '@angular/animations';

export const routeAnimation = trigger('routeAnimation', [

  // leave: fade-out, enter: fade-in + slide-left
  transition('LoginPage => ChooseFarmPage, ChooseFarmPage => CropListPage', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%',
      })
    ]),
    query(':enter', [
      style({
        left: '100%',
        opacity: 0,
      })
    ]),
    group([
      query(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0 }))
      ]),
      query(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in-out', style({
          left: '0%',
          opacity: 1,
        })),
      ]),
    ]),
  ]),

  // leave: fade-out, enter: fade-in + slide-right
  transition('CropViewPage => CropListPage, CropFormPage => CropListPage', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%',
      })
    ]),
    query(':enter', [
      style({
        left: '-100%',
        opacity: 0,
      })
    ]),
    group([
      query(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0 }))
      ]),
      query(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in-out', style({
          left: '0%',
          opacity: 1,
        })),
      ]),
    ]),
  ]),

  // leave: fade-out, enter: fade-in
  transition('* => *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%',
      })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in-out', style({ opacity: 1 }))
      ], { optional: true }),
    ]),
  ]),

]);