import { async, inject, TestBed } from '@angular/core/testing';

import { NoteService } from './note.service';

describe('NoteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NoteService
      ]
    });
  });


  it('can instantiate service when injecting service',
  inject([NoteService], (service: NoteService) => {
    expect(service instanceof NoteService).toBe(true);
  }));

});
