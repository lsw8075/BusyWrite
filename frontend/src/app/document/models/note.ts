export class Note {
  id: number;
  document: number;
  owner: number;
  content: string;
  order: number;

  constructor(
    id: number,
    document: number,
    owner: number,
    content: string = '',
    order: number = 1
  ) {
    this.id = id;
    this.document = document;
    this.owner = owner;
    this.content = content;
    this.order = order;
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
