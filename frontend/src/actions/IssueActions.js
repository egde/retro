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
    },
    deleteIssue(issue) {
        dispatcher.dispatch({
            type: IssueActionTypes.DELETE_ISSUE,
            issue
        })
    },
    bulkSaveIssues(issues) {
        dispatcher.dispatch({
            type: IssueActionTypes.BULKUPDATE_ISSUE,
            issues
        })
    }
}

export default Actions;