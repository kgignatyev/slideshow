import { TestBed } from '@angular/core/testing';

import { ImagesSupplierService } from './images-supplier.service';

describe('ImagesSupplierService', () => {
  let service: ImagesSupplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagesSupplierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
