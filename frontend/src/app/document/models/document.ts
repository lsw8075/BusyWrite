export class Document {
    id: number;
    documentTitle: string;
    constributorIds: Array<number>;

    constructor(
        id: number,
        documentTitle: string,
        constributorIds: Array<number> = []
    ) {
        this.id = id;
        this.documentTitle = documentTitle;
        this.constributorIds = constributorIds;
    }
}
