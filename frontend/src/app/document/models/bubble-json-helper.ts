import { BubbleTemp, LeafBubbleTemp } from './bubble-temp';

export class BubbleJsonHelper {
  constructor() {
  }

  getBubbleArrayObject(jsonString: string): Array<BubbleTemp> {
    const jsonObjectArray = JSON.parse(jsonString);
    let bubbleList: Array<BubbleTemp> = [];

    for (const jsonObject of jsonObjectArray) {
      let bubble = new LeafBubbleTemp(jsonObject.id, jsonObject.content);
      bubble.thumbUps = jsonObject.thumbUps;
      bubbleList.push(bubble);
    }
    return bubbleList;
  }
}
