import React, { Component } from 'react';
import Issue from '../components/Issue.jsx';
import IssueEntity from '../entities/Issue.js';

import IssueActions from '../actions/IssueActions';
import IssueStore from '../actions/IssueStore';
import { EventTypes as IssueEventTypes } from '../actions/IssueActionTypes';

import BoardActions from '../actions/BoardActions';
import BoardStore from '../actions/BoardStore';
import { EventTypes as BoardEventTypes } from '../actions/BoardActionTypes';

class Board extends Component {
    
    constructor(props) {
        super(props)
        
        this.state = {
            board : {
            },
            issues : [
            ]
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
        IssueStore.on(IssueEventTypes.LOAD_ISSUES_COMPLETED, this.setIssues);
    }

    componentWillUnmount() {
        BoardStore.removeListener(BoardEventTypes.LOAD_BOARD_COMPLETED, this.setBoard);
        IssueStore.removeListener(IssueEventTypes.LOAD_ISSUES_COMPLETED, this.setIssues);
    }

    componentDidMount() {
        const boardId = this.props.match.params.id;
        BoardActions.loadBoard(boardId);
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
        
        const ind = issues.findIndex((issue) => {
            return issue.id === id;
        });
        
        if (ind >= 0) {
            issues.splice(ind, 1);
            this.setState({issues: issues});
        }
        
    }
    
    addIssue(e) {
        const state = e.target.name;
        var issues = this.state.issues;
        var issue = new IssueEntity();
        issue.boardId = this.state.board.id;
        issue.state = state;
        
        issues.push(issue);
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
                                            {
                                                issues.map((issue, ind) => {
                                                    return (<Issue issue={issue} states={this.state.board.states} key={ind} name={issue.id} onChange={this.handleChange} onDelete={this.deleteEntry} onFocusOut={this.saveEntry}/>)
                                                })
                                            }
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
                    <h1 className="Title">Nothing found here</h1>
                </section>)
        }
    }
   
}

export default Board;