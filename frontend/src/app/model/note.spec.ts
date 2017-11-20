import { Note } from './note';

describe('note model', () => {
  describe('when create note with content', () => {
    let note: Note;
    let id: number;
    let content: string;
    let userId: number;
    let documentId: number;

    beforeEach(() => {
      id = 1;
      userId = 1;
      documentId = 1;
      content = '<p>123456789<strong>1011121314</strong>15161718192021222324252627282930</p>';
      note = new Note(id, documentId, userId, content);
    });

    it('should return summary of document', () => {
      expect(note.getSummary()).toBe('123456789101112131415161718192...');
    });
  });

  describe('when create note without content', () => {
    let note: Note;
    let id: number;
    let userId: number;
    let documentId: number;

    beforeEach(() => {
      id = 1;
      userId = 1;
      documentId = 1;
      note = new Note(id, documentId, userId);
    });

    it('should return "empty note" if content is empty', () => {
      note.content = '';
      expect(note.getSummary()).toBe('empty note');
    });

  });

});

