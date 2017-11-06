import { async, inject, TestBed } from '@angular/core/testing';

import { DocumentService } from './document.service';

describe('NoteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DocumentService
      ]
    });
  });


  it('can instantiate service when injecting service',
  inject([DocumentService], (service: DocumentService) => {
    expect(service instanceof DocumentService).toBe(true);
  }));

});
