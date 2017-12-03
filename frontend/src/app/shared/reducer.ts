import { UserReducer, UserState } from '../user/reducers/user-reducer';
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import {
    StoreRouterConnectingModule,
    routerReducer,
    RouterReducerState,
    RouterStateSerializer
  } from '@ngrx/router-store';
import { Params, RouterStateSnapshot } from '@angular/router';

import { RouterStateUrl } from './route/route-reduce';
export { CustomSerializer } from './route/route-reduce';


export interface State {
  user: UserState;
  router: RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<State> = {
  user: UserReducer,
  router: routerReducer,
};

export const getUserState = createFeatureSelector<UserState>('user');


