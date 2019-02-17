import {EventEmitter} from 'events';
import {ActionTypes, EventTypes}  from './BoardActionTypes';
import dispatcher from '../Dispatcher';
import axios from 'axios';

class BoardStore extends EventEmitter{
    constructor(props) {
        super(props);
        this.boards = [];
        this.board = {};
    }

    getBoards() {
        return this.boards;
    }
    
    getBoard() {
        return this.board;
    }
    
    loadBoards(ownerId) {
        axios.get('/api/boards')
            .then((res) => {
                    this.boards = res.data;
                    this.emit(EventTypes.LOAD_BOARDS_COMPLETED);
                })
            .catch((err) => {
                console.log(err)
            });
    }
    
    loadBoard(boardId) {
        axios.get('/api/boards/'+boardId)
            .then((res) => {
                this.board = res.data;
                this.emit(EventTypes.LOAD_BOARD_COMPLETED);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    
    addBoard(board) {
        axios.post('/api/boards',board)
            .then((res) => {
                this.loadBoards(board.ownerId);        
            })
            .catch((err) => {
                console.log(err);
            });
    }


    handleActions(action) {
        switch(action.type) {
            case ActionTypes.LOAD_BOARDS:
                if (!action.ownerId) {
                    this.emit(EventTypes.LOAD_BOARDS_COMPLETED);
                    break;
                }
                this.loadBoards(action.ownerId);
                break;
            case ActionTypes.LOAD_BOARD:
                if (!action.boardId) {
                    this.emit(EventTypes.LOAD_BOARD_COMPLETED);
                    break;
                }
                this.loadBoard(action.boardId);
                break;
            case ActionTypes.ADD_BOARD:
                if(!action.board) {
                    this.emit(EventEmitter.LOAD_BOARDS_COMPLETED);
                    break;
                }
                this.addBoard(action.board);
                break;
            default:
                return;
        }
    }
}

const boardStore = new BoardStore();
dispatcher.register( boardStore.handleActions.bind(boardStore));

export default boardStore;