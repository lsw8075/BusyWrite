import { async, inject, TestBed } from '@angular/core/testing';

import { DirectoryService } from './directory.service';

describe('NoteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DirectoryService
      ]
    });
  });


  it('can instantiate service when injecting service',
  inject([DirectoryService], (service: DirectoryService) => {
    expect(service instanceof DirectoryService).toBe(true);
  }));

});
