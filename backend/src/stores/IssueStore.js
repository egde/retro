var uuid = require('uuid/v4');

class IssueStore {
    constructor() {
        this.issues = {};
    }
    
    getAll() {
        var entries = Object.keys(this.issues).map((key) => {
                             return this.issues[key];
                        });
        return entries;
    }
    
    saveNewIssue(issue) {
        issue.id = uuid();
        issue.dbId = issue.id;
        this.issues[ issue.id ] = issue;
        return issue.id;
    }
    
    updateIssue(issue) {
        this.issues[ issue.id ] = issue;
        return issue.id;
    }
    
    getIssue(issueId) {
        const b = this.issues[issueId];
        return b;
    }
    
    deleteIssue(issueId) {
        const b = this.issues[issueId];
        
        if (b) {
            delete this.issues[issueId]
            return issueId;
        }
    }
}

var issueStore = new IssueStore();
module.exports = issueStore;