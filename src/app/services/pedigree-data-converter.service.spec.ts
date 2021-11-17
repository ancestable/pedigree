import { IDatasetModelWithRecords } from '@ancestable/shared';
import { TestBed } from '@angular/core/testing';
import { testData } from 'src/assets/test-data';

import { PedigreeDataConverterService } from './pedigree-data-converter.service';

describe('PedigreeDataConverterService', () => {
  let service: PedigreeDataConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedigreeDataConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert gedcom to pedigree', () => {
    const response = service.convertDatasetToPedigree(testData as unknown as IDatasetModelWithRecords, '@I1@');
    console.log(response);
  });
});
