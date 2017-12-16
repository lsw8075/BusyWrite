import { Action } from '@ngrx/store';
import { FileSystemEntity } from '../models/file-system-entity';

export const LOAD = '[File] Load';
export const LOAD_COMPLETE = '[File] load Complete';
export const LOAD_ERROR = '[File] load Error';

export const SELECT = '[File] Select';

export const CREATE = '[File] create';
export const CREATE_COMPLETE = '[File] create Complete';
export const CREATE_ERROR = '[File] create Error';

export const EDIT = '[File] edit';
export const EDIT_COMPLETE = '[File] edit Complete';
export const EDIT_ERROR = '[File] edit Error';

export const DELETE = '[File] delete';
export const DELETE_COMPLETE = '[File] delete Complete';
export const DELETE_ERROR = '[File] delete Error';

export const OPEN = '[File] Open';

export class Load implements Action {
    readonly type = LOAD;
    constructor() {}
}

export class LoadComplete implements Action {
    readonly type = LOAD_COMPLETE;
    constructor(public payload: FileSystemEntity[]) {}
}

export class LoadError implements Action {
    readonly type = LOAD_ERROR;
    constructor(public payload: string) {}
}

export class Select implements Action {
    readonly type = SELECT;
    constructor(public payload: FileSystemEntity) {}
}

export class Create implements Action {
    readonly type = CREATE;
    constructor() {}
}

export class CreateComplete implements Action {
    readonly type = CREATE_COMPLETE;
    constructor(public payload: FileSystemEntity) {}
}

export class CreateError implements Action {
    readonly type = CREATE_ERROR;
    constructor(public payload: string) {}
}

export class Open implements Action {
    readonly type = OPEN;
    constructor(public payload: FileSystemEntity) {}
}

export type Actions =
    | Load
    | LoadComplete
    | LoadError
    | Create
    | CreateComplete
    | CreateError
    | Select
    | Open;
