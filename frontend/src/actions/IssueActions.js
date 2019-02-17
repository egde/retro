import IssueActionTypes from './IssueActionTypes';
import dispatcher from '../Dispatcher';

const Actions = {
    loadIssues(boardId) {
        dispatcher.dispatch({
            type: IssueActionTypes.LOAD_ISSUES,
            boardId
        });
    },
    saveIssue(issue) {
        dispatcher.dispatch({
            type: IssueActionTypes.SAVE_ISSUE,
            issue
        })
    }
}

export default Actions;