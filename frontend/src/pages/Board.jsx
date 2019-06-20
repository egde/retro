import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {withCookies} from 'react-cookie';
import v4 from 'uuid/v4';

import Issue from '../components/Issue.jsx';
import IssueEntity from '../entities/Issue.js';
import JoinSection from '../components/JoinSection';

import IssueActions from '../actions/IssueActions';
import IssueStore from '../actions/IssueStore';
import { EventTypes as IssueEventTypes } from '../actions/IssueActionTypes';

import BoardActions from '../actions/BoardActions';
import BoardStore from '../actions/BoardStore';
import { EventTypes as BoardEventTypes } from '../actions/BoardActionTypes';

class Board extends Component {
    
    constructor(props) {
        super(props)
        
        const { cookies } = props;
        let userId = cookies.get('uuid');
        if (!userId) {
            userId = v4();
            cookies.set('uuid', userId)
        }

        this.state = {
            board : {
            },
            issues : [
            ],
            userId : userId
        }
        this.handleChange = this.handleChange.bind(this);
        this.addIssue = this.addIssue.bind(this);
        this.deleteEntry = this.deleteEntry.bind(this);
        this.setBoard = this.setBoard.bind(this);
        this.setIssues = this.setIssues.bind(this);
        this.saveEntry = this.saveEntry.bind(this);
    }
    
    componentWillMount() {
        BoardStore.on(BoardEventTypes.LOAD_BOARD_COMPLETED, this.setBoard);
        BoardStore.on(BoardEventTypes.ADD_BOARD_USER_COMPLETED, this.addBoardUserCompleted);
        IssueStore.on(IssueEventTypes.LOAD_ISSUES_COMPLETED, this.setIssues);
        IssueStore.on(IssueEventTypes.DELETE_ISSUE_COMPLETED, this.deleteIssueCompleted);
    }

    componentWillUnmount() {
        BoardStore.removeListener(BoardEventTypes.LOAD_BOARD_COMPLETED, this.setBoard);
        BoardStore.removeListener(BoardEventTypes.ADD_BOARD_USER_COMPLETED, this.addBoardUserCompleted);
        IssueStore.removeListener(IssueEventTypes.LOAD_ISSUES_COMPLETED, this.setIssues);
        IssueStore.removeListener(IssueEventTypes.DELETE_ISSUE_COMPLETED, this.deleteIssueCompleted);
    }

    componentDidMount() {
        const boardId = this.props.match.params.id;
        BoardActions.loadBoard(boardId);
        IssueActions.loadIssues(boardId);
    }
    
    addBoardUserCompleted = () => {
        const boardId = this.props.match.params.id;
        BoardActions.loadBoard(boardId);
    }

    deleteIssueCompleted = () => {
        const boardId = this.props.match.params.id;
        IssueActions.loadIssues(boardId);
    }

    setBoard() {
        this.setState({board: BoardStore.getBoard()});
    }
    
    setIssues() {
        this.setState({issues: IssueStore.getIssues()});
    }
    
    saveEntry(id) {
        var issues = this.state.issues;
        
        const issue = issues.find((issue) => {
            return issue.id === id;
        });
        
        IssueActions.saveIssue(issue);
    }
    
    deleteEntry(id) {
        var issues = this.state.issues;
        
        const issue = issues.find((issue) => {
            return issue.id === id;
        });

        if (issue) {
            IssueActions.deleteIssue(issue);
        }
    }
    
    isUserInBoard = () => {
        const board = this.state.board;
        const userId = this.state.userId;

        const found = board.users.find((u) => {
            return u.userId === userId
        });

        return !found ? false : true;
    }

    addIssue(e) {
        const state = e.target.name;
        var issues = this.state.issues;
        var issue = new IssueEntity();
        issue.boardId = this.state.board.id;
        issue.state = state;
        issue.ownerId = this.state.userId;
        
        issues.push(issue);
        if (!this.isUserInBoard()) {
            BoardActions.addBoardUser(issue.boardId, this.state.userId);
        }
        this.setState({issues:issues});
    }
    
    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        if (target.type === 'issue') {
            var issues = this.state.issues;
            const ind = issues.findIndex((issue) => {
                return issue.id === name
            });
            if (ind >= 0) {
                issues[ind] = value;
                
                this.setState({issues : issues});
            }
        }
    }
    
    render() {
        if (this.state.board) {
            return (
                <section id="board" className="section">
                    <div className="container">
                    <h1 className="title">{`Board - ${this.state.board.title}`}</h1>
                        <nav className="breadcrumb" aria-label="breadcrumbs">
                        <ul>
                            <li><Link to="/">Boards</Link></li>
                            <li class="is-active"><Link to="." aria-current="page">{this.state.board.title}</Link></li>
                        </ul>
                        </nav>
                        <div className="columns">
                            {
                                this.state.board.states && this.state.board.states.map((state, ind) => {
                                    var issues = this.state.issues.filter((issue) => {
                                        return (issue.state === state);
                                    })
                                    return (
                                        <div key={state} className="column">
                                            <div className="has-background-light">
                                            <div className="level">
                                                <div className="level-left">
                                                    <div className="level-item">
                                                        <p className="heading">{state}</p> 
                                                    </div>
                                                </div>
                                                <div className="level-right">
                                                    <div className="level-item">
                                                        <button name={state} className="button is-primary is-small" onClick={this.addIssue}>Add</button>
                                                    </div>
                                                </div>
                                            </div>
                                                    
                                            <div className="section">
                                                <div className="content">
                                                    <div className="tile is-ancestor">
                                                        <div className="tile is-parent is-vertical">
                                                            {
                                                                issues.map((issue, ind) => {
                                                                    return (<Issue issue={issue} states={this.state.board.states} userId={this.state.userId} key={ind} name={issue.id} onChange={this.handleChange} onDelete={this.deleteEntry} onFocusOut={this.saveEntry}/>)
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                        </div>)
                                })
                            }
                        </div>
                    </div>
                </section>
            )
        }
         else {
            return (
                <section className="section">
                    <div className="container">
                        <h1 className="title">Sorry...</h1>
                        <div class="notification">
                            <p>The retro board you are looking for does not exist</p>
                            <p>You tried accessing the board with the id: <strong>{this.props.match.params.id}</strong></p>
                            <br/>
                            <Link className="button is-primary" to="/">Return</Link>
                        </div>
                    </div>
                </section>
                )
        }
    }
   
}

export default withCookies(Board);