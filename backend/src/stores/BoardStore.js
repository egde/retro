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
            var found = b.users.find((user) => {
                return user.userId === userId
            });
            return found != null;
        })
        
        return results.length == 0 ? null : results;
    }

    generateId() {
        var max = 99999;
        var min = 1;
        var random = Math.floor(Math.random() * (+max - +min)) + +min; 
        var id = ""+random;
        return id.padStart(5, "0");
    }
    
    saveNewBoard(board) {
        // generate an ID and check it if it unique. If not generate a new ID
        board.id = this.generateId();
        while (this.boards[ board.id ]) {
            board.id = this.generateId();
        }

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