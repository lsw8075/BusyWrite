import { async, inject, TestBed } from '@angular/core/testing';

import { NoteService } from './note.service';
import { Note } from '../model/note';

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

  it('can call ngOnInit',
  inject([NoteService], (service: NoteService) => {
    service.ngOnInit();
  }));

  it('can add a note',
  inject([NoteService], (service: NoteService) => {
    service.addNote().then((note) => expect(note.content).toEqual('note 3'));
  }));

  it('can get a note by note id',
  inject([NoteService], (service: NoteService) => {
    service.getNote(3).then((note) => expect(note).toBeNull());
  }));

  it('can update a note',
  inject([NoteService], (service: NoteService) => {
    let note = new Note(1, 1, 1, 'note x');
    service.updateNote(note).then((note) => expect(note).toBeNull());
  }));

  it('can delete a note',
  inject([NoteService], (service: NoteService) => {
    let note = new Note(1, 1, 1, 'note x');
    service.deleteNote(note).then((note) => expect(note).toBeNull());
  }));

  it('can get the list of notes by user id',
  inject([NoteService], (service: NoteService) => {
    service.getNotes(1).then((notes) => expect(notes[1].content).toEqual('note 2'));
  }));

});
