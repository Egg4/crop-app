import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

import { LibModule } from '../lib/lib.module';
import { config } from '../config/config';
import { CropStore } from '../stores/crop-store.service';
import { CropFactory } from '../factories/crop-factory.service';

describe('CropStore (with mocks)', () => {
  let httpMock: HttpTestingController;
  let cropStore: CropStore;
  let cropFactory: CropFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, TranslateModule.forRoot(), LibModule ],
      providers: [ CropStore ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    cropStore = TestBed.inject(CropStore);
    cropFactory = TestBed.inject(CropFactory);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return crops', () => {
    const crops = [
      cropFactory.create(),
      cropFactory.create(),
    ];
    cropStore.list().subscribe(result => {
      expect(result).toEqual(crops);
    });
    const testRequest = httpMock.expectOne(`${ config.api.url }/crop`);
    expect(testRequest.request.method).toBe('GET');
    testRequest.flush(crops);
  });

  it('should cache crops', () => {
    const crops = [
      cropFactory.create(),
      cropFactory.create(),
     ];
    cropStore.list().subscribe(_ => {
      cropStore.list().subscribe(result => {
	    expect(result).toEqual(crops, 'crops should be cached');
	  });
    });

    const testRequests = httpMock.match(`${ config.api.url }/crop`);
    expect(testRequests.length).toBe(1);
    testRequests[0].flush(crops);
  });

  it('should cache crop', () => {
    const crops = [
      cropFactory.create({ id: 1 }),
      cropFactory.create(),
     ];
    cropStore.list().subscribe(_ => {
      cropStore.read(1).subscribe(result => {
	    expect(result).toEqual(crops[0], 'crop should be cached');
	  });
    });

    const testRequests = httpMock.match(`${ config.api.url }/crop`);
    expect(testRequests.length).toBe(1);
    testRequests[0].flush(crops);
  });

  it('should create crop', () => {
    const crop = cropFactory.create();
    cropStore.create(crop).subscribe(result => {
      expect(result).toEqual(crop);
    });
    const testRequest = httpMock.expectOne(`${ config.api.url }/crop`);
    expect(testRequest.request.method).toBe('POST');
    testRequest.flush(crop);
  });

  it('should update crop', () => {
    const crop = cropFactory.create();
    cropStore.update(crop).subscribe(result => {
      expect(result).toEqual(crop);
    });
    const testRequest = httpMock.expectOne(`${ config.api.url }/crop/${ crop.id }`);
    expect(testRequest.request.method).toBe('PATCH');
    testRequest.flush(crop);
  });

  it('should delete crop', () => {
    const crop = cropFactory.create();
    cropStore.delete(crop.id).subscribe();
    const testRequest = httpMock.expectOne(`${ config.api.url }/crop/${ crop.id }`);
    expect(testRequest.request.method).toBe('DELETE');
    testRequest.flush(crop);
  });

});
