import { Board, EditItem } from './board';
import { Bubble, LeafBubble } from './bubble';

describe('board model', () => {

});

describe('Edit Item Model', () => {
  let editItem: EditItem;
  let id: number;
  let bubble: Bubble;

  beforeEach(() => {
    id = 1;
    bubble = new LeafBubble(0);
  });

  it('can create edit item', () => {
    editItem = new EditItem(id, bubble);
  });
});
