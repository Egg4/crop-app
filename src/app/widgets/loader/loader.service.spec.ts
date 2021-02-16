import { TestBed } from '@angular/core/testing';

import { bufferCount } from 'rxjs/operators';

import { Loader } from './loader.service';

describe('Loader', () => {
​
  let loader: Loader;

  beforeAll(() => {
    TestBed.configureTestingModule({ providers: [Loader] });
    loader = TestBed.inject(Loader);
  });

  xit('should display on loading 2 urls then hide', () => {
	loader.loading.pipe(
      bufferCount(3)
    ).subscribe(buffer => {
      expect(buffer[0]).toBe(false);
      expect(buffer[1]).toBe(true);
      expect(buffer[2]).toBe(false);
    });

	loader.startLoading('url1');
	loader.startLoading('url2');
	loader.stopLoading('url1');
	loader.stopLoading('url2');
  });
​
});