import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InvitationReducer, InvitationState } from './invitation-reducer';
import * as fromRoot from '../../shared/reducer';


export interface State extends fromRoot.State {
    'invitation': InvitationState;
}
export { InvitationReducer };

export const getInvitationState = createFeatureSelector<InvitationState>('invitation');
