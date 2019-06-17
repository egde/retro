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
    
    loadBoards(ownerId, userId) {
        axios.get('/api/boards', {
            params: {
                ownerId : ownerId,
                userId : userId
            }
        })
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
                this.loadBoards(board.ownerId, board.ownerId);        
            })
            .catch((err) => {
                console.log(err);
            });
    }

    addBoardUser(boardId, userId) {
        axios.post('/api/boards/'+boardId+'/users', {userId: userId})
            .then((res) => {
                this.emit(EventTypes.ADD_BOARD_USER_COMPLETED);   
            })
            .catch((err) => {
                console.log(err);
            });
    }

    deleteBoard(boardId) {
        axios.delete('/api/boards/'+boardId)
            .then((res) => {
                this.emit(EventTypes.DELETE_BOARD_COMPLETED);
            })
            .catch((err) => {
                console.log(err)
            });
    }

    handleActions(action) {
        switch(action.type) {
            case ActionTypes.LOAD_BOARDS:
                if (!action.userId) {
                    this.emit(EventTypes.LOAD_BOARDS_COMPLETED);
                    break;
                }
                this.loadBoards(action.userId, action.userId);
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
                    this.emit(EventTypes.LOAD_BOARD_COMPLETED);
                    break;
                }
                this.addBoard(action.board);
                break;
            case ActionTypes.ADD_BOARD_USER:
                if(!action.boardId || !action.userId) {
                    this.emit(EventTypes.ADD_BOARD_USER_COMPLETED);
                    break;
                }
                this.addBoardUser(action.boardId, action.userId);
                break;
            case ActionTypes.DELETE_BOARD:
                if(!action.boardId) {
                    this.emit(EventTypes.DELETE_BOARD_COMPLETED);
                    break;
                }
                this.deleteBoard(action.boardId);
                break;
            default:
                return;
        }
    }
}

const boardStore = new BoardStore();
dispatcher.register( boardStore.handleActions.bind(boardStore));

export default boardStore;