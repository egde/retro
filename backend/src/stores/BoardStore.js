var uuid = require('uuid/v4');

class BoardStore {
    constructor() {
        this.boards = {};
    }
    
    getAll() {
        var entries = Object.keys(this.boards).map((key) => {
                             return this.boards[key];
                        });
        return entries.length == 0 ? null : entries;
    }

    getByOwnerId(ownerId) {
        var entries = Object.keys(this.boards).map((key) => {
                             return this.boards[key];
                        });
        var results = entries.filter((b) => {
            return b.ownerId === ownerId
        })

        return results.length == 0 ? null : results;
    }

    getByUserId(userId) {
        var entries = Object.keys(this.boards).map((key) => {
                             return this.boards[key];
                        });
        var results = entries.filter((b) => {
            return b.userId === userId
        })
        
        return results.length == 0 ? null : results;
    }
    
    saveNewBoard(board) {
        board.id = uuid();
        this.boards[ board.id ] = board;
        return board.id;
    }
    
    updateBoard(board) {
        this.boards[ board.id ] = board;
        return board.id;
    }
    
    getBoard(boardId) {
        const b = this.boards[boardId];
        return b;
    }
    
    deleteBoard(boardId) {
        const b = this.boards[boardId];
        
        if (b) {
            delete this.boards[boardId]
            return boardId;
        }
    }
}

var boardStore = new BoardStore();
module.exports = boardStore;