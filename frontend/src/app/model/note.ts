export class Note {
  id: number;
  documentId: number;
  userId: number;
  content: string;

  constructor(
    id: number,
    documentId: number,
    userId: number,
    content: string = '',
  ) {
    this.id = id;
    this.documentId = documentId;
    this.userId = userId;
    this.content = content;
  }

  public getSummary() {
    if (this.content) {
      const summary = this.removeTags(this.content).slice(0, 30);
      return `${summary}...`;
    } else {
      return `empty note`;
    }
  }

  private removeTags(content: string): string {
    const htmlRegex = /(<([^>]+)>)/ig;
    return content.replace(htmlRegex, '');
  }
}
