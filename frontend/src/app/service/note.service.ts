import { Injectable, OnInit } from '@angular/core';
import { Note } from '../model/note';

@Injectable()
export class NoteService implements OnInit {
  constructor() {}

  ngOnInit() {}

  addNote(): Promise<Note> {
    const newNote3: Note = new Note(3, 1, 1, 'note 3');
    return Promise.resolve(newNote3);
  }

  updateNote(note: Note): Promise<Note> {
    return Promise.resolve(null);
  }

  deleteNote(note: Note): Promise<null> {
    return Promise.resolve(null);
  }

  getNote(noteId: number): Promise<Note> {
    return Promise.resolve(null);
  }

  getNotes(userId: number): Promise<Array<Note>> {
    const notes: Array<Note> = [];
    const newNote1: Note = new Note (1, 1, 1, 'note 1');
    const newNote2: Note = new Note (2, 1, 1, 'note 2');
    notes.push(newNote1);
    notes.push(newNote2);
    return Promise.resolve(notes);
  }

}
