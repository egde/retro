var express = require("express");
var router = express.Router();
var issueStore = require('./stores/IssueStore');

router.get("/", (req,res) => {
    const boardId = req.query.boardId;
    var result = issueStore.getAll();
    
    if (boardId) {
        result = result.filter((entry) => {
            return entry.boardId === boardId
        })    
    }
    
    res.send(result);
    res.end();
});

router.get("/:issueId", (req,res) => {
    if (!req.params.issueId) {
        throw new Error("Issue ID required")
    }
    const issue = issueStore.getIssue(req.params.issueId);
    if (!issue) {
        res.status(404);
    } else {
        res.send(issue);
    }
    res.end();
});

router.delete("/:issueId", (req, res) => {
    if (!req.params.issueId) {
        throw new Error("Issue ID required");
    }
    
    const issueId = issueStore.deleteIssue(req.params.issueId);
    
    if (!issueId) {
        res.status(404);
    } else {
        res.send({id:issueId});
    }
    res.end();
});

router.post("/", (req, res) => {
    var issue=req.body;
    if (!issue) {
        throw new Error("An issue object is missing here!")
    }
    const id = issueStore.saveNewIssue(issue);
    res.send(
        {
            id: id
        });
});

router.post("/bulk", (req, res) => {
    var issues = req.body

    if (!issues) {
        throw new Error("An issues object is missing here!")
    }

    const result = issues.map(issue => {
        issueStore.updateIssue(issue);
    });

    res.send({
        ids: result
    });

})

router.post("/:issueId", (req, res) => {
    var issue=req.body;
    if (!issue) {
        throw new Error("A board object is missing here!")
    }
    const id = issueStore.updateIssue(issue);
    res.send(
        {
            id: id
        });
});
module.exports = router;
