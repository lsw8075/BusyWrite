import { Action } from '@ngrx/store';
import { Board, BoardType, BoardLocation } from '../models/board';

import * as fromBoard from '../actions/board-action';
import * as _ from 'lodash';

export const maxEditBoardCnt = 1;
export const maxBoardCnt = 7;

export interface BoardState {
    newId: number;
    boardList: Board[];
    loading: boolean;
    error: string;

    activeBoard: Board;
}

const initalBoardList = [
    new Board(BoardType.view, BoardLocation.left, 0),
    new Board(BoardType.suggest, BoardLocation.right, 1),
    new Board(BoardType.edit, BoardLocation.hidden, 2),
    new Board(BoardType.filter, BoardLocation.hidden, 3)
];

const initialState: BoardState = {
    newId: 4,
    boardList: initalBoardList,
    loading: false,
    error: '',

    activeBoard: initalBoardList[0],
};

export function BoardReducer(state: BoardState = initialState, action: fromBoard.Actions) {
    let newBoardList = _.cloneDeep(state.boardList);
    switch (action.type) {
        case fromBoard.ADD:
            if (action.payload === BoardType.edit) {
                for (const board of newBoardList) {
                    if (board.type === BoardType.edit) {
                        return {...state, error: 'There already exist edit board'};
                    }
                }
            } else if (action.payload === BoardType.view) {
                for (const board of newBoardList) {
                    if (board.type === BoardType.view) {
                        return {...state, error: 'There already exist view board'};
                    }
                }
            } else if (action.payload === BoardType.filter) {
                for (const board of newBoardList) {
                    if (board.type === BoardType.filter) {
                        return {...state, error: 'There already exist filter board'};
                    }
                }
            } else {
                for (const board of newBoardList) {
                    if (board.type === BoardType.suggest) {
                        return {...state, error: 'There already exist suggest board'};
                    }
                }
            }
            newBoardList.push(new Board(action.payload, BoardLocation.hidden, state.newId));
            return {...state, boardList: newBoardList, newId: (state.newId + 1) };
        case fromBoard.DELETE:
            newBoardList = newBoardList.filter(board => board.id !== action.payload.id);
            console.log(newBoardList);
            return {...state, boardList: newBoardList };
        case fromBoard.DELETE_ALL:
            console.log('delete all board');
            return {...state, boardList: [], activeBoard: null};
        case fromBoard.HIDE:
            const hideBoard = getBoardById(newBoardList, action.payload.id);
            hideBoard.location = BoardLocation.hidden;
            return {...state, boardList: newBoardList };
        case fromBoard.SHOW_LEFT:
        {
            const board = action.payload;
            for (const b of newBoardList) {
                if (b.location === BoardLocation.left) {
                    if (b.id === board.id) {
                        return {...state};
                    }
                    b.location = BoardLocation.hidden;
                }
            }
            const leftBoard = getBoardById(newBoardList, board.id);
            leftBoard.location = BoardLocation.left;
            return {...state, boardList: newBoardList };
        }
        case fromBoard.SHOW_RIGHT:
        {
            const board = action.payload;
            for (const b of newBoardList) {
                if (b.location === BoardLocation.right) {
                    if (b.id === board.id) {
                        return {...state};
                    }
                    b.location = BoardLocation.hidden;
                }
            }
            const rightBoard = getBoardById(newBoardList, board.id);
            rightBoard.location = BoardLocation.right;
            return {...state, boardList: newBoardList };
        }
        case fromBoard.CLEAR_ERROR:
            return {...state, error: ''};

        case fromBoard.SELECT:
            return {...state, activeBoard: {...action.payload}};

        case fromBoard.SHOW_EDIT: {
            const activeBoard = state.activeBoard;
            if (activeBoard.location === BoardLocation.right) {
                const openEditBoard = getBoardByType(newBoardList, BoardType.edit);
                if (openEditBoard == null) {
                    newBoardList.push(new Board(BoardType.edit, BoardLocation.left, state.newId));
                    return {...state, boardList: newBoardList, newId: (state.newId + 1) };
                }
                for (const b of newBoardList) {
                    if (b.location === BoardLocation.left) {
                        b.location = BoardLocation.hidden;
                        openEditBoard.location = BoardLocation.left;
                        return {...state, boardList: newBoardList };
                    }
                }
            } else if (activeBoard.location === BoardLocation.left) {
                const openEditBoard = getBoardByType(newBoardList, BoardType.edit);
                if (openEditBoard == null) {
                    newBoardList.push(new Board(BoardType.edit, BoardLocation.right, state.newId));
                    return {...state, boardList: newBoardList, newId: (state.newId + 1) };
                }
                for (const b of newBoardList) {
                    if (b.location === BoardLocation.right) {
                        b.location = BoardLocation.hidden;
                        openEditBoard.location = BoardLocation.right;
                        return {...state, boardList: newBoardList };
                    }
                }
            }
            return {...state, boardList: newBoardList};
        }
        case fromBoard.SHOW_SANGJUN: {
            const activeBoard = state.activeBoard;
            if (activeBoard.location === BoardLocation.right) {
                const openEditBoard = getBoardByType(newBoardList, BoardType.suggest);
                if (openEditBoard == null) {
                    newBoardList.push(new Board(BoardType.suggest, BoardLocation.left, state.newId));
                    return {...state, boardList: newBoardList, newId: (state.newId + 1) };
                }
                for (const b of newBoardList) {
                    if (b.location === BoardLocation.left) {
                        b.location = BoardLocation.hidden;
                        openEditBoard.location = BoardLocation.left;
                        return {...state, boardList: newBoardList };
                    }
                }
            } else if (activeBoard.location === BoardLocation.left) {
                const openSuggestBoard = getBoardByType(newBoardList, BoardType.suggest);
                if (openSuggestBoard == null) {
                    newBoardList.push(new Board(BoardType.suggest, BoardLocation.right, state.newId));
                    return {...state, boardList: newBoardList, newId: (state.newId + 1) };
                }
                for (const b of newBoardList) {
                    if (b.location === BoardLocation.right) {
                        b.location = BoardLocation.hidden;
                        openSuggestBoard.location = BoardLocation.right;
                        return {...state, boardList: newBoardList };
                    }
                }
            }
            return {...state, boardList: newBoardList};
        }
        default:
            return {...state };
    }
}

function getBoardById(boardList: Board[], boardId: Number): Board {
    for (const board of boardList) {
        if (board.id === boardId) {
            return board;
        }
    }
    return null;
}

function getBoardByType(boardList: Board[], boardType: BoardType): Board {
    for (const board of boardList) {
        if (board.type === boardType) {
            return board;
        }
    }
    return null;
}

function checkBoardAssumption(boardList: Array<Board>): void {
    let leftBoardCnt = 0;
    let rightBoardCnt = 0;
    let editBoardCnt = 0;
    let totBoardCnt = 0;
    boardList.forEach(board => {
        switch (board.location) {
            case BoardLocation.left:
                leftBoardCnt++;
                break;
            case BoardLocation.right:
                rightBoardCnt++;
                break;
        }
        switch (board.type) {
            case BoardType.edit:
                editBoardCnt++;
                break;
        }
        totBoardCnt++;
    });
    console.assert(leftBoardCnt <= 1, 'there are more than one left board');
    console.assert(rightBoardCnt <= 1, 'there are more than one right board');
    console.assert(editBoardCnt <= maxEditBoardCnt, 'there are more edit board than allowed');
    console.assert(totBoardCnt <= maxBoardCnt, 'there are more than boards than allowed');
}
