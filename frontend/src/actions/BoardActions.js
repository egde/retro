import BoardActionTypes from './BoardActionTypes';
import dispatcher from '../Dispatcher';

const Actions = {
    loadBoards(userId) {
        dispatcher.dispatch({
            type: BoardActionTypes.LOAD_BOARDS,
            userId
        });
    },
    loadBoard(boardId) {
        dispatcher.dispatch({
            type: BoardActionTypes.LOAD_BOARD,
            boardId
        })
    },
    addBoard(board) {
        dispatcher.dispatch({
            type: BoardActionTypes.ADD_BOARD,
            board
        })
    },
    addBoardUser(boardId, userId) {
        dispatcher.dispatch({
            type: BoardActionTypes.ADD_BOARD_USER,
            boardId,
            userId
        })
    }
}

export default Actions;