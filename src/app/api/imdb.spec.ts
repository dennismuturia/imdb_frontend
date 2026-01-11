import { TestBed } from '@angular/core/testing';

import { Imdb } from './imdb';

describe('Imdb', () => {
  let service: Imdb;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Imdb);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
