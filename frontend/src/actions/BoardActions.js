import BoardActionTypes from './BoardActionTypes';
import dispatcher from '../Dispatcher';

const Actions = {
    loadBoards(ownerId) {
        dispatcher.dispatch({
            type: BoardActionTypes.LOAD_BOARDS,
            ownerId
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
    }
}

export default Actions;