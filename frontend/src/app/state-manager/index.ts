export { Note } from './note/index';
export { Comment } from './comment/index';
export { User } from './user/index';
export { Bubble, BubbleType } from './bubble/index';

import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { BubbleReducer } from './bubble/reducers/bubble.reducer';

import { BubbleState } from './bubble/reducers/bubble.reducer';


export interface State {
  bubble: BubbleState;
  router: RouterReducerState;
}

export const reducers = {
  bubble: BubbleReducer,
  router: routerReducer,
};

