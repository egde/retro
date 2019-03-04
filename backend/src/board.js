var express = require("express");
var router = express.Router();
var boardStore = require('./stores/BoardStore');

router.get("/", (req,res) => {
    ownerId = req.query.ownerId;
    userId = req.query.userId;
    
    var result = [];
    if (!ownerId && !userId) {
        let v = boardStore.getAll();
        if (v != null) {
            result = result.concat(v);
        }
    }
    else {
        result = {};
        if (ownerId) {
            let v = boardStore.getByOwnerId(ownerId);
            
            if (v != null) {
                result.owned = v;
            }
        }

        if (userId) {
            let v = boardStore.getByUserId(userId);

            if (v != null) {
                result.edited=v;
            }
        }
    }

    res.send(result);
    res.end();
});

router.get("/:boardId", (req,res) => {
    if (!req.params.boardId) {
        throw new Error("Board ID required")
    }
    const board = boardStore.getBoard(req.params.boardId);
    if (!board) {
        res.status(404);
    } else {
        res.send(board);
    }
    res.end();
});

router.post("/:boardId/users", (req, res) => {
    if (!req.params.boardId) {
        throw new Error("Board ID required")
    }
    var board = boardStore.getBoard(req.params.boardId);
    if (!board) {
        res.status(404);
    }
    const user = req.body;
    if (!user) {
        throw new Error("A user object is missing here!");
    }
    board.users.push(user);
    res.send(board.users);
    res.end();
});

router.delete("/:boardId", (req, res) => {
    if (!req.params.boardId) {
        throw new Error("Board ID required");
    }
    
    const boardId = boardStore.deleteBoard(req.params.boardId);
    
    if (!boardId) {
        res.status(404);
    } else {
        res.send({id:boardId});
    }
    res.end();
});

router.post("/", (req, res) => {
    var board=req.body;
    if (!board) {
        throw new Error("A board object is missing here!")
    }
    const id = boardStore.saveNewBoard(board);
    res.send(
        {
            id: id
        });
});

module.exports = router;