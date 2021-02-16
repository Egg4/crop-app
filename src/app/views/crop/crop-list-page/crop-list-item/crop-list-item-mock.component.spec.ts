import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

import { LibModule } from '../../../../lib/lib.module';
import { config } from '../../../../config/config';
import { CropListItemComponent } from './crop-list-item.component';
import { CropFactory } from '../../../../factories/crop-factory.service';
import { PlantFactory } from '../../../../factories/plant-factory.service';

describe('CropListItemComponent (with mock)', () => {
  let component: CropListItemComponent;
  let fixture: ComponentFixture<CropListItemComponent>;
  let httpMock: HttpTestingController;
  let cropFactory: CropFactory;
  let plantFactory: PlantFactory;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CropListItemComponent ],
      imports: [ HttpClientTestingModule, HttpClientModule, TranslateModule.forRoot(), LibModule ],
    })
    .compileComponents();
  });

  beforeEach(() => {
	httpMock = TestBed.inject(HttpTestingController);
    cropFactory = TestBed.inject(CropFactory);
    plantFactory = TestBed.inject(PlantFactory);

    fixture = TestBed.createComponent(CropListItemComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should contain crop name', () => {
	const plants = [
      plantFactory.create({ name: 'Basil' }),
      plantFactory.create({ name: 'Tomato' }),
    ];
    const crop = cropFactory.create({ plant_ids: [ plants[0].id, plants[1].id ] });
    component.crop = crop;
    fixture.detectChanges();

    const testRequest = httpMock.expectOne(`${ config.api.url }/plant`);
    testRequest.flush(plants);

    crop.name$.subscribe(result => {
      expect(result).toBe(`${ plants[0].name } ${ plants[1].name } ${ crop.number }`);
    });
    fixture.detectChanges();

    const htmlElement: HTMLElement = fixture.nativeElement;
    const span = htmlElement.querySelector('button span:nth-child(2)');
    expect(span.textContent).toContain('Basil Tomato');
  });

});