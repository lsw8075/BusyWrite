import { Bubble } from './bubble';

export class BubbleJsonHelper {
  constructor() {
  }
  getBubbleObject(jsonString: string): Bubble {
    let jsonObject: Bubble = JSON.parse(jsonString);
    return jsonObject;
  }
}
