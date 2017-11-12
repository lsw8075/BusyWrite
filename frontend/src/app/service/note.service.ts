import { Injectable, OnInit } from '@angular/core';
import { Note } from '../model/note';

@Injectable()
export class NoteService implements OnInit {
  constructor() {}

  ngOnInit() {

  }

  addNote(): Promise<Note> {
    const newNote3: Note = {
      id: 3,
      content: '',
      documentId: 1,
      userId: 1,
    };
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
    const newNote1: Note = {
      id: 1,
      content: '',
      documentId: 1,
      userId: 1,
    };
    const newNote2: Note = {
      id: 2,
      content: '',
      documentId: 1,
      userId: 1,
    };
    notes.push(newNote1);
    notes.push(newNote2);
    return Promise.resolve(notes);
  }

}
