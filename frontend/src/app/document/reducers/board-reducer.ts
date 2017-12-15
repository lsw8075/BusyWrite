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
    newId: 2,
    boardList: initalBoardList,
    loading: false,
    error: '',

    activeBoard: initalBoardList[0],
};

export function BoardReducer(state: BoardState = initialState, action: fromBoard.Actions) {
    let newBoardList = [...state.boardList];
    switch (action.type) {
        case fromBoard.ADD:
            if (state.boardList.length === maxBoardCnt) {
                return {...state, error: 'maximum board reached!'};
            } else if (action.payload === BoardType.edit) {
                for (const board of newBoardList) {
                    if (board.type === BoardType.edit) {
                        return {...state, error: 'one edit board will be enough'};
                    }
                }
            }
            newBoardList.push(new Board(action.payload, BoardLocation.hidden, state.newId));
            return {...state, boardList: newBoardList, newId: state.newId + 1 };
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
