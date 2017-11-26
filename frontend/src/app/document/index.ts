export { Note } from './models/note';
export { Comment } from './models/comment';
export { User } from './../auth/models/user';
export { Bubble, BubbleType, LeafBubble, InternalBubble, SuggestBubble } from './models/bubble';
export { MenuType } from './services/event/event-bubble.service';

import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { BubbleReducer } from './reducers/bubble.reducer';

import { BubbleState } from './reducers/bubble.reducer';


export interface State {
  bubble: BubbleState;
  router: RouterReducerState;
}

export const reducers = {
  bubble: BubbleReducer,
  router: routerReducer,
};

