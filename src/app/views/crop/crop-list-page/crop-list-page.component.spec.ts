import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

import { of } from 'rxjs';

import { SharedModule } from '../../../shared/shared.module';
import { CropListPageComponent } from './crop-list-page.component';
import { Crop } from '../../../models/crop.model';
import { Plant } from '../../../models/plant.model';
import { CropStore } from '../../../stores/crop-store.service';
import { PlantStore } from '../../../stores/plant-store.service';
import { TaskStore } from '../../../stores/task-store.service';
import { VarietyStore } from '../../../stores/variety-store.service';
import { CropFactory } from '../../../factories/crop-factory.service';
import { PlantFactory } from '../../../factories/plant-factory.service';

@Component({ selector: 'app-crop-list-item', template: '' })
class CropListItemStubComponent { }

describe('CropListPageComponent (with spy)', () => {
  let router: any;
  let bottomSheet: any;
  let dialog: any;
  let snackbar: any;
  let cropStore: any;
  let plantStore: any;
  let taskStore: any;
  let varietyStore: any;
  let cropFactory: CropFactory;
  let plantFactory: PlantFactory;
  let component: CropListPageComponent;
  let fixture: ComponentFixture<CropListPageComponent>;
  let rootElement: HTMLElement;
  let rootDebug: DebugElement;
  let crops: Crop[];
  let plants: Plant[];

  beforeEach(async () => {
	router = jasmine.createSpyObj('Router', ['navigate']);
	bottomSheet = jasmine.createSpyObj('MatBottomSheet', ['open']);
	dialog = jasmine.createSpyObj('MatDialog', ['open']);
	snackbar = jasmine.createSpyObj('MatSnackBar', ['open']);
	cropStore = jasmine.createSpyObj('CropStore', ['list']);
	plantStore = jasmine.createSpyObj('PlantStore', ['read']);
	taskStore = jasmine.createSpyObj('TaskStore', ['read']);
	varietyStore = jasmine.createSpyObj('VarietyStore', ['read']);

    await TestBed.configureTestingModule({
      declarations: [
        CropListPageComponent,
        CropListItemStubComponent,
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [
	    BrowserAnimationsModule,
        TranslateModule.forRoot(),
        SharedModule,
      ],
      providers: [
	    { provide: Router, useValue: router },
        { provide: MatBottomSheet, useValue: bottomSheet },
        { provide: MatDialog, useValue: dialog },
        { provide: MatSnackBar, useValue: snackbar },
	    { provide: CropStore, useValue: cropStore },
        { provide: PlantStore, useValue: plantStore },
        { provide: TaskStore, useValue: taskStore },
        { provide: VarietyStore, useValue: varietyStore },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CropListPageComponent);
    component = fixture.componentInstance;
    rootElement = fixture.nativeElement;
    rootDebug = fixture.debugElement;
  });

  beforeEach(() => {
    cropFactory = TestBed.inject(CropFactory);
    plantFactory = TestBed.inject(PlantFactory);
    plants = [
      plantFactory.create({ name: 'A' }),
      plantFactory.create({ name: 'B' }),
      plantFactory.create({ name: 'C' }),
    ];
    plantStore.read.and.callFake(
      id => of(plants.find(plant => plant.id === id))
    );
    crops = [
      cropFactory.create({ plant_ids: [ plants[0].id ] }),
      cropFactory.create({ plant_ids: [ plants[1].id ] }),
      cropFactory.create({ plant_ids: [ plants[2].id ] }),
    ];
    cropStore.list.and.returnValue(of(crops));
  });

  it('should display list', () => {
    fixture.detectChanges();

    const items = rootElement.querySelectorAll<HTMLElement>('app-crop-list-item');
    expect(items.length).toBe(3);
  });

  it('should add click lead to open dialog', () => {
    const dialogOpenSpy = dialog.open.and.returnValue({
	  afterClosed() { return of(undefined) } // Simulate closing dialog
    });

    fixture.detectChanges();
    const add = rootElement.querySelector<HTMLElement>('button.fixed-add-fab-button');
    add.click();

    expect(dialogOpenSpy).toHaveBeenCalled();
  });

  it('should item click lead to router navigate', () => {
    fixture.detectChanges();
    const item = rootElement.querySelector<HTMLElement>('app-crop-list-item');
    item.click();

    expect(router.navigate).toHaveBeenCalledWith([`/crop/${ crops[0].id }`]);
  });

  it('should item press lead to open bottomSheet', () => {
    const bottomSheetSpy = bottomSheet.open.and.returnValue({
	  afterDismissed() { return of(undefined) } // Simulate closing bottomSheet
    });

    fixture.detectChanges();
    const itemDebug = rootDebug.query(By.css('app-crop-list-item'));
    itemDebug.triggerEventHandler('press', null);

    expect(bottomSheetSpy).toHaveBeenCalled();
  });

});