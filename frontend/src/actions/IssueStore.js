import {EventEmitter} from 'events';
import {ActionTypes, EventTypes}  from './IssueActionTypes';
import dispatcher from '../Dispatcher';
import axios from 'axios';

class IssueStore extends EventEmitter{
    constructor(props) {
        super(props);
        this.issues = [];
    }

    getIssues() {
        return this.issues;
    }
    
    loadIssues(boardId) {
        
        axios.get('/api/issues',    {
                                        params: {
                                            boardId : boardId
                                        }
                                    })
            .then((res) => {
                this.issues = res.data;
                this.emit(EventTypes.LOAD_ISSUES_COMPLETED);
            })
            .catch((err) => {
                console.log(err);
            })
        
        
    }
    
    saveIssue(issue) {
        if (issue.dbId) {
            axios.post('/api/issues/'+issue.dbId, issue)
                .then((res) => {
                    this.loadIssues(issue.boardId);
                    this.emit(EventTypes.SAVE_ISSUE_COMPLETED);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            axios.post('/api/issues', issue )
                .then((res) => {
                    this.loadIssues(issue.boardId);
                    this.emit(EventTypes.SAVE_ISSUE_COMPLETED);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    deleteIssue(issue) {
        axios.delete('/api/issues/'+issue.dbId)
            .then((res)=> {
                this.emit(EventTypes.DELETE_ISSUE_COMPLETED);
            })
            .catch((err) => {
                console.log(err);
            });
    }


    handleActions(action) {
        switch(action.type) {
            case ActionTypes.LOAD_ISSUES:
                if (!action.boardId) {
                    this.emit(EventTypes.LOAD_ISSUES_COMPLETED);
                    break;
                }
                this.loadIssues(action.boardId);
                break;
            case ActionTypes.SAVE_ISSUE:
                if(!action.issue) {
                    this.emit(EventTypes.SAVE_ISSUE_COMPLETED);
                    break;
                }
                this.saveIssue(action.issue);
                break;
            case ActionTypes.DELETE_ISSUE:
                if(!action.issue) {
                    this.emit(EventTypes.DELETE_ISSUE_COMPLETED);
                }
                this.deleteIssue(action.issue);
                break;
            default:
                return;
        }
    }
}

const issueStore = new IssueStore();
dispatcher.register( issueStore.handleActions.bind(issueStore));

export default issueStore;